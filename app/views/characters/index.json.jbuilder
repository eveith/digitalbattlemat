json.array!(@characters) do |character|
  json.extract! character, :id, :name, :description, :ruleset
end
