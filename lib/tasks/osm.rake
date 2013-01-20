namespace :fetch do
  desc "Fetch Way from OSM API and save it to DB."
  task :way, [:osmid] => :environment do |t, args|
    abort "Aborted. Must specify osmid." if (!args.osmid)
    Way.fetch_from_OSM(args.osmid)
  end
end

