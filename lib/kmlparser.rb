require 'pp'
require 'rest_client'
require 'xmlsimple'
require 'json'

class KMLParser
  attr_accessor :map_ids, :ways

  def initialize(map_ids)
    @map_ids = map_ids
    @gm_data
    @ways = []
    @points = []
  end

  def gm_data
    @gm_data ||= _fetch_gm_data
  end
  def gm_data=(data)
    @gm_data = data
  end
  def _fetch_gm_data
    data = []
    @map_ids.each do |map_id|
      body = RestClient.get "https://maps.google.com/maps/ms?authuser=0&vps=2&ie=UTF8&msa=0&output=kml&msid=#{map_id}"
      data.push(XmlSimple.xml_in(body))
    end
    self.gm_data = data
  end

  def parse
    data = self.gm_data
    placemarks = data["Document"][0]["Placemark"]
    placemarks.select{|p| not p["Point"]}.each do |placemark|
      next if placemark["Point"]
      coords = self.extract_coords(placemark)
      way = {
        "positions" => self.build_positions(coords),
        "category" => "trail",
        "name" => placemark["name"][0],
      }
      @ways.push(way)
    end
  end

  def to_json
    if @ways.length == 0
      self.parse
    end
    return JSON.pretty_generate(@ways)
  end

  def extract_coords(placemark)
    coords = ''
    if (placemark["LineString"])
      coords = placemark["LineString"][0]["coordinates"][0]
    elsif (placemark["Polygon"])
      coords = placemark["Polygon"][0]["outerBoundaryIs"][0]["LinearRing"][0]["coordinates"][0]
    elsif (placemark["Point"])
      coords = placemark["Point"][0]["coordinates"][0]
    end
    return coords.strip.split(/\n +/)
  end

  def build_positions(coords)
    positions = []
    coords.each do |coord|
      lon, lat, alt = coord.split(',')
      positions.push({:node => {:lat => lat, :lon => lon}})
    end
    return positions
  end
end
