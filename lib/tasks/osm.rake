require 'kmlparser'

namespace :osm do
  desc "Fetch Way from OSM API and save it to DB."
  task :fetch_way, [:osmid] => :environment do |t, args|
    abort "Aborted. Must specify osmid." if (!args.osmid)
    enabled = args.enabled || 1;
    Way.fetch_from_OSM(args.osmid, enabled)
  end

  desc "Fetch ALL necessary data from OSM."
  task :fetch_all => :environment do
    ways = [
      [167568763, 1],
      [144058297, 1],
      [157350060, 1],
      [144058293, 1],
      [144058295, 1],
      [139118026, 1],
      [144058296, 1],
      [167568770, 1],
      [167568768, 1],
      [167568769, 1],
      [167568766, 1],
      [135538146, 1],
      [142227334, 1],
      [144058294, 1],
      [142228699, 0],
      [142227337, 1],
      [142228705, 0],
      [142228700, 0],
      [142228711, 0],
      [142228712, 0],
      #[142228714, 1],
      #[142228701, 1],
      [142228812, 0],
      [142228813, 0],
      [142228852, 0],
      [138882522, 0],
      [138669843, 1],
      #[138669842, 1],
      #[138883124, 1],
      [138669805, 1],
      [144068004, 0],
      [144861245, 0],
      [144861608, 0],
      [144861249, 0],
      [144861248, 0],
      [140003490, 0],
      [140003487, 0],

      [135534908, 1],
      [139215660, 1],
    ]
    ways.each do |way|
      Rake::Task['osm:fetch_way'].execute(OpenStruct.new({:osmid => way[0], :enabled => way[1]}))
    end
  end
end

namespace :gm do
  desc "Fetch map data from Google Maps and save to JSON."
  task :fetch => :environment do
    puts KMLParser.new(['201404948400955778919.0004d6ea86b20318ce63f']).to_json
  end
end
