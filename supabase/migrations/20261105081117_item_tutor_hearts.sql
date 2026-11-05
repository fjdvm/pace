BEGIN;
ALTER TABLE hearts_states DROP CONSTRAINT hearts_states_pkey;
DROP INDEX hearts_states_student_id_item_id_key;
ALTER TABLE hearts_states ADD CONSTRAINT hearts_states_pkey PRIMARY KEY (student_id, item_id);
CREATE INDEX hearts_states_assignment_id_idx ON hearts_states(assignment_id);
CREATE INDEX chat_messages_student_id_item_id_created_at_idx ON chat_messages(student_id, item_id, created_at);
COMMIT;
