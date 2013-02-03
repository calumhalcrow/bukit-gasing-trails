require 'rest_client'
require 'xmlsimple'

class Way < ActiveRecord::Base
  attr_accessible :category, :name
  has_many :positions, :order => '"order"'
  has_many :nodes, :through => :positions

  def self.fetch_from_OSM(osmid)
    # Hit OSM API.
    body = RestClient.get "http://www.openstreetmap.org/api/0.6/way/#{osmid}"
    way_data = XmlSimple.xml_in(body)

    way = Way.create(:category => 'trail')

    way_data['way'][0]['nd'].each_with_index do |node_data, index|
      body = RestClient.get "http://www.openstreetmap.org/api/0.6/node/#{node_data['ref']}"
      node_data = XmlSimple.xml_in(body)

      node = Node.create(
        :lat => node_data['node'][0]['lat'],
        :lon => node_data['node'][0]['lon'],
        :osmid => node_data['node'][0]['id'])

      Position.create(
        :order => index,
        :way_id => way.id,
        :node_id => node.id)
    end
  end
end
