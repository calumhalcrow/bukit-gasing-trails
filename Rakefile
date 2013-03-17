#!/usr/bin/env rake

require 'kmlparser'

namespace :gm do
  desc "Fetch map data from Google Maps and save to JSON."
  task :fetch do
    json = KMLParser.new(
      '201404948400955778919.0004d6ea86b20318ce63f',
      '201404948400955778919.0004d6fd2a97c2705dce7').to_json
    File.open('js/map.json', 'w') {|f| f.puts json }
  end
end

namespace :deploy do
  desc "Deploy site to production."
  task :full do
    `sass --update sass/style.scss:css/style.css`
    Rake::Task["gm:fetch"].invoke
    `bundle exec jekyll --no-auto --no-server`
    `appcfg.py update _site`
  end
end
