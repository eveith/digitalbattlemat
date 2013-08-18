json.array!(@characters) do |character|
  json.extract! character, :name, :description, :characteristics
  json.url character_url(character, format: :json)
end
