json.array!(@mats) do |mat|
  json.extract! mat, :hash, :user_id, :title
  json.url mat_url(mat, format: :json)
end
