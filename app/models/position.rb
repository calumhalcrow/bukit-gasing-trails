class Position < ActiveRecord::Base
  attr_accessible :desc, :node_id, :order, :title, :way_id, :enabled, :has_image, :has_icon
  belongs_to :way
  belongs_to :node
end
