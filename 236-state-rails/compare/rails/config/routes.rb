Rails.application.routes.draw do
  root "counters#show"
  post "visitor" => "counters#visitor"
  post "everyone" => "counters#everyone"
  post "saved" => "counters#saved"
  post "synced" => "counters#synced"
end
