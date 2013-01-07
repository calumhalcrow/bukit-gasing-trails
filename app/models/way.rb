class Way < ActiveRecord::Base
  attr_accessible :category, :name
  has_many :nodes, :inverse_of => :way
end
