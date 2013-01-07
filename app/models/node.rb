class Node < ActiveRecord::Base
  attr_accessible :lat, :lon, :osmid, :way_id
  belongs_to :way, :inverse_of => :nodes
end
