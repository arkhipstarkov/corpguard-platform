CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT generateUUIDv4(),
    user_id Int32,
    action String,
    entity String,
    entity_id Int32,
    created_at DateTime DEFAULT now()
)
ENGINE = MergeTree
ORDER BY (created_at);
