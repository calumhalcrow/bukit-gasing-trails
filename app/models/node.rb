class Node < ActiveRecord::Base
  attr_accessible :lat, :lon, :osmid, :way_id
  has_many :positions
  has_many :ways, :through => :positions
end
