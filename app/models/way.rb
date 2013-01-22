require 'rest_client'
require 'xmlsimple'

class Way < ActiveRecord::Base
  attr_accessible :category, :name
  has_many :positions
  has_many :nodes, :through => :positions

  def self.fetch_from_OSM(osmid)
    # Hit OSM API.
    @body = RestClient.get "http://www.openstreetmap.org/api/0.6/way/#{osmid}"
    @data = XmlSimple.xml_in(@body)
    puts @data.inspect

    #Add way info and nodes to new model

    # save model.
  end
end
