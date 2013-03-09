#!/usr/bin/env rake

require 'kmlparser'

namespace :gm do
  desc "Fetch map data from Google Maps and save to JSON."
  task :fetch do
    puts KMLParser.new(['201404948400955778919.0004d6ea86b20318ce63f']).to_json
  end
end
