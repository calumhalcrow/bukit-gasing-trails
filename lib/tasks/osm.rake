namespace :osm do
  desc "Fetch Way from OSM API and save it to DB."
  task :fetch_way, [:osmid] => :environment do |t, args|
    abort "Aborted. Must specify osmid." if (!args.osmid)
    Way.fetch_from_OSM(args.osmid)
  end

  desc "Fetch ALL necessary data from OSM."
  task :fetch_all => :environment do
    ways = [167568763]
    ways.each do |osmid|
      Rake::Task['osm:fetch_way'].execute(OpenStruct.new({:osmid => osmid}))
    end
  end
end

