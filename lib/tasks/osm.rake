namespace :osm do
  desc "Fetch Way from OSM API and save it to DB."
  task :fetch_way, [:osmid] => :environment do |t, args|
    abort "Aborted. Must specify osmid." if (!args.osmid)
    Way.fetch_from_OSM(args.osmid)
  end

  desc "Fetch ALL necessary data from OSM."
  task :fetch_all => :environment do
    ways = [
      167568763, 144058297, 157350060, 144058293, 144058295, 139118026, 144058296, 167568770, 167568768,
      139215657, 167568769, 167568766, 135538146,
      142227334,
      142228699, # places
      142227337, # parking
      142228705, 142228700, 142228711, 142228712, 142228714, 142228701, 142228812, 142228813, 142228852, # reservoir related.
      138882522, 138669843, 138669842, 138883124, 138669805,
      144068004, 144861245, 144861608,
      144861249, 144058294, 144861248, 140003490, 140003487,
    ]
    ways.each do |osmid|
      Rake::Task['osm:fetch_way'].execute(OpenStruct.new({:osmid => osmid}))
    end
  end
end
