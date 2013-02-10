require 'rest_client'
require 'xmlsimple'

class Way < ActiveRecord::Base
  attr_accessible :category, :name, :enabled, :desc, :osmid
  has_many :positions, :order => '"order"'
  has_many :nodes, :through => :positions

  def self.fetch_from_OSM(osmid)
    # Hit OSM API.
    body = RestClient.get "http://www.openstreetmap.org/api/0.6/way/#{osmid}"
    way_data = XmlSimple.xml_in(body)

    name, amenity, landuse, highway, bridge, leisure = nil
    way_data['way'][0]['tag'].each do |tag|
      if tag['k'] == 'name'
        name = tag['v']
      elsif tag['k'] == 'amenity'
        amenity = tag['v']
      elsif tag['k'] == 'landuse'
        landuse = tag['v']
      elsif tag['k'] == 'highway'
        highway = tag['v']
      elsif tag['k'] == 'bridge'
        bridge = tag['v']
      elsif tag['k'] == 'leisure'
        leisure = tag['v']
      end
    end

    category = (highway == 'unclassified') ? 'road' : bridge ? 'bridge' : (landuse == 'forest') ? 'boundary' : (amenity || landuse || leisure || 'trail')

    way = Way.create(:category => category, :name => name, :osmid => osmid)

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
