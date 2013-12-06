# ==========================================
# BOWER: Registry
# ==========================================
# Copyright 2013 Twitter, Inc
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

require 'rubygems'
require 'sinatra'
require 'json'
require 'sequel'
require 'sinatra/sequel'

migration 'create packages' do
  database.create_table :packages do
    primary_key :id
    String :name, :unique => true, :null => false
    String :url, :unique => true, :null => false
    DateTime :created_at
    index :name
  end
end

migration 'add hits' do
  database.alter_table :packages do
    add_column :hits, Integer, :default => 0
  end
end

class Package < Sequel::Model
  def hit!
    self.hits += 1
    self.save(:validate => false)
  end

  def validate
    super
    errors.add(:url, 'is not correct format') if url !~ /^git:\/\//
  end

  def as_json
    {:name => name, :url => url}
  end

  def to_json(*)
    as_json.to_json
  end
end

get '/packages' do
  Package.order(:name).all.to_json
end

post '/packages' do
  begin
    Package.create(
      :name => params[:name],
      :url  => params[:url]
    )
    201
  rescue Sequel::ValidationFailed
    400
  rescue Sequel::DatabaseError
    406
  end
end

get '/packages/:name' do
  package  = Package[:name => params[:name]]

  return 404 unless package

  package.hit!
  package.to_json
end

get '/packages/search/:name' do
  packages = Package.filter(:name.ilike("%#{params[:name]}%")).order(:hits.desc)
  packages.all.to_json
end
