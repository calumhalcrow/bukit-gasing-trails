require 'pp'
require 'rest_client'
require 'xmlsimple'
require 'json'

class KMLParser
  attr_accessor :map_ids, :ways, :points

  def initialize(*map_ids)
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
      data << XmlSimple.xml_in(body)
    end
    self.gm_data = data
  end

  def parse
    data = self.gm_data

    placemarks = []
    data.each do |elt|
      elt["Document"][0]["Placemark"].each do |p|
        placemarks << p
      end
    end

    _extract_ways(placemarks)
    _extract_points(placemarks)
  end

  def _extract_ways(placemarks)
    placemarks.select{|p| not p["Point"]}.each do |placemark|
      coords = self._extract_coords(placemark)
      way = {
        "positions" => self._build_positions(coords),
        "name" => placemark["name"][0],
        "category" => "trail",
      }
      if (placemark["description"].is_a? Array and placemark["description"][0].is_a? String)
        way = way.merge(self._extract_meta_info(placemark))
      end
      @ways << way
    end
  end

  def _extract_points(placemarks)
    placemarks.select{|p| p["Point"]}.each do |placemark|
      lon, lat, alt = self._extract_coords(placemark)[0].split(',')
      point = {
        "name" => placemark["name"][0],
        "node" => {"lat" => lat, "lon" => lon},
      }
      point = point.merge(self._extract_meta_info(placemark))
      @points << point
    end
  end

  def _extract_meta_info(placemark)
    model = {}
    meta = JSON.parse(placemark["description"][0])
    model["category"] = meta["category"]
    model["desc"] = meta["desc"]
    model["thumb"] = meta["thumb"]
    model["disabled"] = meta["disabled"]
    return model
  end

  def to_json
    if @ways.length == 0 or @points.length == 0
      self.parse
    end
    return JSON.pretty_generate({"ways" => @ways, "points" => @points})
  end

  def _extract_coords(placemark)
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

  def _build_positions(coords)
    positions = []
    coords.each do |coord|
      lon, lat, alt = coord.split(',')
      positions << {:node => {:lat => lat, :lon => lon}}
    end
    return positions
  end
end
