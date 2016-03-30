package mc

import (
	"bytes"
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"net"
	"strings"
	"sync"
)

// Errors
var (
	ErrNotFound       = errors.New("mc: not found")
	ErrKeyExists      = errors.New("mc: key exists")
	ErrValueTooLarge  = errors.New("mc: value to large")
	ErrInvalidArgs    = errors.New("mc: invalid arguments")
	ErrValueNotStored = errors.New("mc: value not stored")
	ErrNonNumeric     = errors.New("mc: incr/decr called on non-numeric value")
	ErrAuthRequired   = errors.New("mc: authentication required")
	ErrUnknownCommand = errors.New("mc: unknown command")
	ErrOutOfMemory    = errors.New("mc: out of memory")
)

var errMap = map[uint16]error{
	0:    nil,
	1:    ErrNotFound,
	2:    ErrKeyExists,
	3:    ErrValueTooLarge,
	4:    ErrInvalidArgs,
	5:    ErrValueNotStored,
	6:    ErrNonNumeric,
	0x20: ErrAuthRequired,
	0x81: ErrUnknownCommand,
	0x82: ErrOutOfMemory,
}

// Ops
const (
	OpGet = uint8(iota)
	OpSet
	OpAdd
	OpReplace
	OpDelete
	OpIncrement
	OpDecrement
	OpQuit
	OpFlush
	OpGetQ
	OpNoop
	OpVersion
	OpGetK
	OpGetKQ
	OpAppend
	OpPrepend
	OpStat
	OpSetQ
	OpAddQ
	OpReplaceQ
	OpDeleteQ
	OpIncrementQ
	OpDecrementQ
	OpQuitQ
	OpFlushQ
	OpAppendQ
	OpPrependQ
)

// Auth Ops
const (
	OpAuthList = uint8(iota + 0x20)
	OpAuthStart
	OpAuthStep
)

type header struct {
	Magic        uint8
	Op           uint8
	KeyLen       uint16
	ExtraLen     uint8
	DataType     uint8
	ResvOrStatus uint16
	BodyLen      uint32
	Opaque       uint32
	CAS          uint64
}

type msg struct {
	header
	iextras []interface{}
	oextras []interface{}
	key     string
	val     string
}

type Conn struct {
	rwc io.ReadWriteCloser
	l   sync.Mutex
	buf *bytes.Buffer
}

func Dial(nett, addr string) (*Conn, error) {
	nc, err := net.Dial(nett, addr)
	if err != nil {
		return nil, err
	}

	cn := &Conn{rwc: nc, buf: new(bytes.Buffer)}
	return cn, nil
}

func (cn *Conn) Close() error {
	return cn.rwc.Close()
}

func (cn *Conn) Get(key string) (val string, cas int, flags uint32, err error) {
	m := &msg{
		header: header{
			Op: OpGet,
		},

		oextras: []interface{}{&flags},
		key: key,
	}

	err = cn.send(m)

	return m.val, int(m.CAS), flags, err
}

func (cn *Conn) Set(key, val string, ocas, flags, exp int) error {
	m := &msg{
		header: header{
			Op:  OpSet,
			CAS: uint64(ocas),
		},

		iextras: []interface{}{uint32(flags), uint32(exp)},
		key:     key,
		val:     val,
	}

	return cn.send(m)
}

func (cn *Conn) Del(key string) error {
	m := &msg{
		header: header{
			Op: OpDelete,
		},

		key: key,
	}

	return cn.send(m)
}

func (cn *Conn) Incr(key string, delta, init, exp int) (n, cas int, err error) {
	return cn.incrdecr(OpIncrement, key, delta, init, exp)
}

func (cn *Conn) Decr(key string, delta, init, exp int) (n, cas int, err error) {
	return cn.incrdecr(OpDecrement, key, delta, init, exp)
}

func (cn *Conn) Auth(user, pass string) error {
	s, err := cn.authList()
	if err != nil {
		return err
	}

	switch {
	case strings.Index(s, "PLAIN") != -1:
		return cn.authPlain(user, pass)
	}

	return fmt.Errorf("mc: unknown auth types %q", s)
}

func (cn *Conn) authList() (s string, err error) {
	m := &msg{
		header: header{
			Op: OpAuthList,
		},
	}

	err = cn.send(m)
	return m.val, err
}

func (cn *Conn) authPlain(user, pass string) error {
	m := &msg{
		header: header{
			Op: OpAuthStart,
		},

		key: "PLAIN",
		val: fmt.Sprintf("\x00%s\x00%s", user, pass),
	}

	return cn.send(m)
}

func (cn *Conn) incrdecr(op uint8, key string, delta, init, exp int) (n, cas int, err error) {
	m := &msg{
		header: header{
			Op: op,
		},

		key:     key,
		iextras: []interface{}{uint64(delta), uint64(delta), uint32(exp)},
	}

	err = cn.send(m)
	if err != nil {
		return
	}

	return readInt(m.val), int(m.CAS), nil
}

func (cn *Conn) send(m *msg) (err error) {
	m.Magic = 0x80
	m.ExtraLen = sizeOfExtras(m.iextras)
	m.KeyLen = uint16(len(m.key))
	m.BodyLen = uint32(m.ExtraLen) + uint32(m.KeyLen) + uint32(len(m.val))

	cn.l.Lock()
	defer cn.l.Unlock()

	// Request
	err = binary.Write(cn.buf, binary.BigEndian, m.header)
	if err != nil {
		return
	}

	for _, e := range m.iextras {
		err = binary.Write(cn.buf, binary.BigEndian, e)
		if err != nil {
			return
		}
	}

	_, err = io.WriteString(cn.buf, m.key)
	if err != nil {
		return
	}

	_, err = io.WriteString(cn.buf, m.val)
	if err != nil {
		return
	}

	cn.buf.WriteTo(cn.rwc)

	// Response
	err = binary.Read(cn.rwc, binary.BigEndian, &m.header)
	if err != nil {
		return err
	}

	bd := make([]byte, m.BodyLen)
	_, err = io.ReadFull(cn.rwc, bd)
	if err != nil {
		return err
	}

	buf := bytes.NewBuffer(bd)

	for _, e := range m.oextras {
		err = binary.Read(buf, binary.BigEndian, e)
		if err != nil {
			return
		}
	}

	m.key = string(buf.Next(int(m.KeyLen)))

	vlen := int(m.BodyLen) - int(m.ExtraLen) - int(m.KeyLen)
	m.val = string(buf.Next(int(vlen)))

	return checkError(m)
}

func checkError(m *msg) error {
	err, ok := errMap[m.ResvOrStatus]
	if !ok {
		return errors.New("mc: unknown error from server")
	}
	return err
}

func sizeOfExtras(extras []interface{}) (l uint8) {
	for _, e := range extras {
		switch e.(type) {
		default:
			panic(fmt.Sprintf("mc: unknown extra type (%T)", e))
		case uint8:
			l += 8 / 8
		case uint16:
			l += 16 / 8
		case uint32:
			l += 32 / 8
		case uint64:
			l += 64 / 8
		}
	}
	return
}

func readInt(b string) int {
	switch len(b) {
	case 8: // 64 bit
		return int(uint64(b[7]) | uint64(b[6])<<8 | uint64(b[5])<<16 | uint64(b[4])<<24 |
			uint64(b[3])<<32 | uint64(b[2])<<40 | uint64(b[1])<<48 | uint64(b[0])<<56)
	}

	panic(fmt.Sprintf("mc: don't know how to parse string with %d bytes", len(b)))
}
