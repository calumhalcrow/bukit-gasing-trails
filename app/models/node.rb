class Node < ActiveRecord::Base
  attr_accessible :lat, :lon, :osmid, :way_id
end
