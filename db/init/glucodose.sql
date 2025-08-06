--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET lock_timeout = 0;

SET idle_in_transaction_session_timeout = 0;

SET client_encoding = 'UTF8';

SET standard_conforming_strings = on;

SELECT pg_catalog.set_config ('search_path', '', false);

SET check_function_bodies = false;

SET xmloption = content;

SET client_min_messages = warning;

SET row_security = off;

--
-- Name: audit_data; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA audit_data;

ALTER SCHEMA audit_data OWNER TO postgres;

--
-- Name: SCHEMA audit_data; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA audit_data IS 'Auditoría: accesos y cambios en los datos';

--
-- Name: biz_data_dose_recommendations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA biz_data_dose_recommendations;

ALTER SCHEMA biz_data_dose_recommendations OWNER TO postgres;

--
-- Name: SCHEMA biz_data_dose_recommendations; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA biz_data_dose_recommendations IS 'Reglas de negocio: recomendaciones personalizadas de dosis';

--
-- Name: core_data_doses; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA core_data_doses;

ALTER SCHEMA core_data_doses OWNER TO postgres;

--
-- Name: SCHEMA core_data_doses; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA core_data_doses IS 'Datos principales: guías y mappings de dosis';

--
-- Name: core_data_foods; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA core_data_foods;

ALTER SCHEMA core_data_foods OWNER TO postgres;

--
-- Name: SCHEMA core_data_foods; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA core_data_foods IS 'Datos principales: alimentos, categorías y nutrientes';

--
-- Name: core_data_measurements; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA core_data_measurements;

ALTER SCHEMA core_data_measurements OWNER TO postgres;

--
-- Name: SCHEMA core_data_measurements; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA core_data_measurements IS 'Datos principales: mediciones de glucosa e insulina';

--
-- Name: core_data_patients; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA core_data_patients;

ALTER SCHEMA core_data_patients OWNER TO postgres;

--
-- Name: SCHEMA core_data_patients; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA core_data_patients IS 'Datos principales: información de pacientes y alergias';

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: core_data_foods; Owner: postgres
--

CREATE FUNCTION core_data_foods.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

ALTER FUNCTION core_data_foods.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access_logs; Type: TABLE; Schema: audit_data; Owner: postgres
--

CREATE TABLE audit_data.access_logs (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    user_id uuid NOT NULL,
    access_time timestamp without time zone DEFAULT now() NOT NULL,
    action character varying(255) NOT NULL,
    ip_address character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE audit_data.access_logs OWNER TO postgres;

--
-- Name: change_logs; Type: TABLE; Schema: audit_data; Owner: postgres
--

CREATE TABLE audit_data.change_logs (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    entity character varying(100) NOT NULL,
    entity_id uuid NOT NULL,
    change_type character varying(50) NOT NULL,
    changed_by uuid NOT NULL,
    change_time timestamp without time zone DEFAULT now() NOT NULL,
    details text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE audit_data.change_logs OWNER TO postgres;

--
-- Name: dose_recommendations; Type: TABLE; Schema: biz_data_dose_recommendations; Owner: postgres
--

CREATE TABLE biz_data_dose_recommendations.dose_recommendations (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    patient_id uuid NOT NULL,
    dose_id uuid NOT NULL,
    conditions text,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE biz_data_dose_recommendations.dose_recommendations OWNER TO postgres;

--
-- Name: dose_guidelines; Type: TABLE; Schema: core_data_doses; Owner: postgres
--

CREATE TABLE core_data_doses.dose_guidelines (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    description text NOT NULL,
    units character varying(50) NOT NULL,
    insulin_type character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_doses.dose_guidelines OWNER TO postgres;

--
-- Name: dose_mappings; Type: TABLE; Schema: core_data_doses; Owner: postgres
--

CREATE TABLE core_data_doses.dose_mappings (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    food_id uuid NOT NULL,
    dose_id uuid NOT NULL,
    dose_amount numeric(8, 3) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_doses.dose_mappings OWNER TO postgres;

--
-- Name: food_categories; Type: TABLE; Schema: core_data_foods; Owner: postgres
--

CREATE TABLE core_data_foods.food_categories (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_foods.food_categories OWNER TO postgres;

--
-- Name: food_category_mappings; Type: TABLE; Schema: core_data_foods; Owner: postgres
--

CREATE TABLE core_data_foods.food_category_mappings (
    food_id uuid NOT NULL,
    category_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_foods.food_category_mappings OWNER TO postgres;

--
-- Name: food_nutrients; Type: TABLE; Schema: core_data_foods; Owner: postgres
--

CREATE TABLE core_data_foods.food_nutrients (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    food_id uuid NOT NULL,
    nutrient character varying(100) NOT NULL,
    amount numeric(8, 3) NOT NULL,
    unit character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_foods.food_nutrients OWNER TO postgres;

--
-- Name: foods; Type: TABLE; Schema: core_data_foods; Owner: postgres
--

CREATE TABLE core_data_foods.foods (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    name character varying(255) NOT NULL,
    carbs numeric(6, 2) NOT NULL,
    proteins numeric(6, 2) NOT NULL,
    fats numeric(6, 2) NOT NULL,
    calories numeric(8, 2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_foods.foods OWNER TO postgres;

--
-- Name: glucose_measurements; Type: TABLE; Schema: core_data_measurements; Owner: postgres
--

CREATE TABLE core_data_measurements.glucose_measurements (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    patient_id uuid NOT NULL,
    value numeric(6, 2) NOT NULL,
    measurement_time timestamp without time zone NOT NULL,
    context character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_measurements.glucose_measurements OWNER TO postgres;

--
-- Name: insulin_doses; Type: TABLE; Schema: core_data_measurements; Owner: postgres
--

CREATE TABLE core_data_measurements.insulin_doses (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    patient_id uuid NOT NULL,
    dose_amount numeric(8, 3) NOT NULL,
    dose_time timestamp without time zone NOT NULL,
    insulin_type character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_measurements.insulin_doses OWNER TO postgres;

--
-- Name: daily_dose_events; Type: TABLE; Schema: core_data_patients; Owner: postgres
--

CREATE TABLE core_data_patients.daily_dose_events (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    patient_id uuid NOT NULL,
    dose_id uuid NOT NULL,
    dose_amount numeric(8, 3) NOT NULL,
    event_time timestamp without time zone DEFAULT now() NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_patients.daily_dose_events OWNER TO postgres;

--
-- Name: daily_food_events; Type: TABLE; Schema: core_data_patients; Owner: postgres
--

CREATE TABLE core_data_patients.daily_food_events (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    patient_id uuid NOT NULL,
    food_id uuid NOT NULL,
    amount numeric(8, 2) NOT NULL,
    event_time timestamp without time zone DEFAULT now() NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_patients.daily_food_events OWNER TO postgres;

--
-- Name: patient_allergies; Type: TABLE; Schema: core_data_patients; Owner: postgres
--

CREATE TABLE core_data_patients.patient_allergies (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    allergy character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_patients.patient_allergies OWNER TO postgres;

--
-- Name: patient_allergy_mappings; Type: TABLE; Schema: core_data_patients; Owner: postgres
--

CREATE TABLE core_data_patients.patient_allergy_mappings (
    patient_id uuid NOT NULL,
    allergy_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_patients.patient_allergy_mappings OWNER TO postgres;

--
-- Name: patient_diet_mappings; Type: TABLE; Schema: core_data_patients; Owner: postgres
--

CREATE TABLE core_data_patients.patient_diet_mappings (
    patient_id uuid NOT NULL,
    diet_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_patients.patient_diet_mappings OWNER TO postgres;

--
-- Name: patient_diets; Type: TABLE; Schema: core_data_patients; Owner: postgres
--

CREATE TABLE core_data_patients.patient_diets (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    diet_plan text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_patients.patient_diets OWNER TO postgres;

--
-- Name: patients; Type: TABLE; Schema: core_data_patients; Owner: postgres
--

CREATE TABLE core_data_patients.patients (
    id uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255),
    phone character varying(50),
    dob date NOT NULL,
    diagnosis_date date,
    type_diabetes character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE core_data_patients.patients OWNER TO postgres;

--
-- Data for Name: access_logs; Type: TABLE DATA; Schema: audit_data; Owner: postgres
--


COPY audit_data.access_logs (id, user_id, access_time, action, ip_address, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: change_logs; Type: TABLE DATA; Schema: audit_data; Owner: postgres
--


COPY audit_data.change_logs (id, entity, entity_id, change_type, changed_by, change_time, details, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: dose_recommendations; Type: TABLE DATA; Schema: biz_data_dose_recommendations; Owner: postgres
--


COPY biz_data_dose_recommendations.dose_recommendations (id, patient_id, dose_id, conditions, notes, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: dose_guidelines; Type: TABLE DATA; Schema: core_data_doses; Owner: postgres
--


COPY core_data_doses.dose_guidelines (id, description, units, insulin_type, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: dose_mappings; Type: TABLE DATA; Schema: core_data_doses; Owner: postgres
--


COPY core_data_doses.dose_mappings (id, food_id, dose_id, dose_amount, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: food_categories; Type: TABLE DATA; Schema: core_data_foods; Owner: postgres
--


COPY core_data_foods.food_categories (id, name, description, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: food_category_mappings; Type: TABLE DATA; Schema: core_data_foods; Owner: postgres
--


COPY core_data_foods.food_category_mappings (food_id, category_id, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: food_nutrients; Type: TABLE DATA; Schema: core_data_foods; Owner: postgres
--


COPY core_data_foods.food_nutrients (id, food_id, nutrient, amount, unit, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: foods; Type: TABLE DATA; Schema: core_data_foods; Owner: postgres
--


COPY core_data_foods.foods (id, name, carbs, proteins, fats, calories, created_at, updated_at) FROM stdin;
3206b958-cde4-4fce-a45a-03c143421aaa	cuajada	10.00	5.00	2.00	100.00	2025-07-27 17:42:42.601175	2025-07-27 17:42:42.601175
3377a8e8-8408-445c-89e6-ae21c4c77521	flan	20.00	5.00	2.00	100.00	2025-07-27 18:14:02.423301	2025-07-27 18:37:30.669251
\.

--
-- Data for Name: glucose_measurements; Type: TABLE DATA; Schema: core_data_measurements; Owner: postgres
--


COPY core_data_measurements.glucose_measurements (id, patient_id, value, measurement_time, context, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: insulin_doses; Type: TABLE DATA; Schema: core_data_measurements; Owner: postgres
--


COPY core_data_measurements.insulin_doses (id, patient_id, dose_amount, dose_time, insulin_type, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: daily_dose_events; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--


COPY core_data_patients.daily_dose_events (id, patient_id, dose_id, dose_amount, event_time, notes, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: daily_food_events; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--


COPY core_data_patients.daily_food_events (id, patient_id, food_id, amount, event_time, notes, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: patient_allergies; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--


COPY core_data_patients.patient_allergies (id, allergy, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: patient_allergy_mappings; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--


COPY core_data_patients.patient_allergy_mappings (patient_id, allergy_id, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: patient_diet_mappings; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--


COPY core_data_patients.patient_diet_mappings (patient_id, diet_id, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: patient_diets; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--


COPY core_data_patients.patient_diets (id, diet_plan, created_at, updated_at) FROM stdin;
\.

--
-- Data for Name: patients; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--


COPY core_data_patients.patients (id, name, email, phone, dob, diagnosis_date, type_diabetes, created_at, updated_at) FROM stdin;
\.

--
-- Name: access_logs access_logs_pkey; Type: CONSTRAINT; Schema: audit_data; Owner: postgres
--

ALTER TABLE ONLY audit_data.access_logs
ADD CONSTRAINT access_logs_pkey PRIMARY KEY (id);

--
-- Name: change_logs change_logs_pkey; Type: CONSTRAINT; Schema: audit_data; Owner: postgres
--

ALTER TABLE ONLY audit_data.change_logs
ADD CONSTRAINT change_logs_pkey PRIMARY KEY (id);

--
-- Name: dose_recommendations dose_recommendations_pkey; Type: CONSTRAINT; Schema: biz_data_dose_recommendations; Owner: postgres
--

ALTER TABLE ONLY biz_data_dose_recommendations.dose_recommendations
ADD CONSTRAINT dose_recommendations_pkey PRIMARY KEY (id);

--
-- Name: dose_guidelines dose_guidelines_pkey; Type: CONSTRAINT; Schema: core_data_doses; Owner: postgres
--

ALTER TABLE ONLY core_data_doses.dose_guidelines
ADD CONSTRAINT dose_guidelines_pkey PRIMARY KEY (id);

--
-- Name: dose_mappings dose_mappings_food_id_dose_id_key; Type: CONSTRAINT; Schema: core_data_doses; Owner: postgres
--

ALTER TABLE ONLY core_data_doses.dose_mappings
ADD CONSTRAINT dose_mappings_food_id_dose_id_key UNIQUE (food_id, dose_id);

--
-- Name: dose_mappings dose_mappings_pkey; Type: CONSTRAINT; Schema: core_data_doses; Owner: postgres
--

ALTER TABLE ONLY core_data_doses.dose_mappings
ADD CONSTRAINT dose_mappings_pkey PRIMARY KEY (id);

--
-- Name: food_categories food_categories_name_key; Type: CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_categories
ADD CONSTRAINT food_categories_name_key UNIQUE (name);

--
-- Name: food_categories food_categories_pkey; Type: CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_categories
ADD CONSTRAINT food_categories_pkey PRIMARY KEY (id);

--
-- Name: food_category_mappings food_category_mappings_pkey; Type: CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_category_mappings
ADD CONSTRAINT food_category_mappings_pkey PRIMARY KEY (food_id, category_id);

--
-- Name: food_nutrients food_nutrients_pkey; Type: CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_nutrients
ADD CONSTRAINT food_nutrients_pkey PRIMARY KEY (id);

--
-- Name: foods foods_name_key; Type: CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.foods
ADD CONSTRAINT foods_name_key UNIQUE (name);

--
-- Name: foods foods_pkey; Type: CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.foods
ADD CONSTRAINT foods_pkey PRIMARY KEY (id);

--
-- Name: glucose_measurements glucose_measurements_pkey; Type: CONSTRAINT; Schema: core_data_measurements; Owner: postgres
--

ALTER TABLE ONLY core_data_measurements.glucose_measurements
ADD CONSTRAINT glucose_measurements_pkey PRIMARY KEY (id);

--
-- Name: insulin_doses insulin_doses_pkey; Type: CONSTRAINT; Schema: core_data_measurements; Owner: postgres
--

ALTER TABLE ONLY core_data_measurements.insulin_doses
ADD CONSTRAINT insulin_doses_pkey PRIMARY KEY (id);

--
-- Name: daily_dose_events daily_dose_events_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.daily_dose_events
ADD CONSTRAINT daily_dose_events_pkey PRIMARY KEY (id);

--
-- Name: daily_food_events daily_food_events_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.daily_food_events
ADD CONSTRAINT daily_food_events_pkey PRIMARY KEY (id);

--
-- Name: patient_allergies patient_allergies_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_allergies
ADD CONSTRAINT patient_allergies_pkey PRIMARY KEY (id);

--
-- Name: patient_allergy_mappings patient_allergy_mappings_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_allergy_mappings
ADD CONSTRAINT patient_allergy_mappings_pkey PRIMARY KEY (patient_id, allergy_id);

--
-- Name: patient_diet_mappings patient_diet_mappings_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_diet_mappings
ADD CONSTRAINT patient_diet_mappings_pkey PRIMARY KEY (patient_id, diet_id);

--
-- Name: patient_diets patient_diets_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_diets
ADD CONSTRAINT patient_diets_pkey PRIMARY KEY (id);

--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patients
ADD CONSTRAINT patients_pkey PRIMARY KEY (id);

--
-- Name: idx_glucose_measurements_patient; Type: INDEX; Schema: core_data_measurements; Owner: postgres
--

CREATE INDEX idx_glucose_measurements_patient ON core_data_measurements.glucose_measurements USING btree (patient_id);

--
-- Name: idx_insulin_doses_patient; Type: INDEX; Schema: core_data_measurements; Owner: postgres
--

CREATE INDEX idx_insulin_doses_patient ON core_data_measurements.insulin_doses USING btree (patient_id);

--
-- Name: idx_daily_dose_events_patient; Type: INDEX; Schema: core_data_patients; Owner: postgres
--

CREATE INDEX idx_daily_dose_events_patient ON core_data_patients.daily_dose_events USING btree (patient_id);

--
-- Name: idx_daily_food_events_patient; Type: INDEX; Schema: core_data_patients; Owner: postgres
--

CREATE INDEX idx_daily_food_events_patient ON core_data_patients.daily_food_events USING btree (patient_id);

--
-- Name: idx_patients_email; Type: INDEX; Schema: core_data_patients; Owner: postgres
--

CREATE INDEX idx_patients_email ON core_data_patients.patients USING btree (email);

--
-- Name: access_logs trg_update_access_logs_updated_at; Type: TRIGGER; Schema: audit_data; Owner: postgres
--

CREATE TRIGGER trg_update_access_logs_updated_at BEFORE UPDATE ON audit_data.access_logs FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: change_logs trg_update_change_logs_updated_at; Type: TRIGGER; Schema: audit_data; Owner: postgres
--

CREATE TRIGGER trg_update_change_logs_updated_at BEFORE UPDATE ON audit_data.change_logs FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: dose_recommendations trg_update_dose_recommendations_updated_at; Type: TRIGGER; Schema: biz_data_dose_recommendations; Owner: postgres
--

CREATE TRIGGER trg_update_dose_recommendations_updated_at BEFORE UPDATE ON biz_data_dose_recommendations.dose_recommendations FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: dose_guidelines trg_update_dose_guidelines_updated_at; Type: TRIGGER; Schema: core_data_doses; Owner: postgres
--

CREATE TRIGGER trg_update_dose_guidelines_updated_at BEFORE UPDATE ON core_data_doses.dose_guidelines FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: dose_mappings trg_update_dose_mappings_updated_at; Type: TRIGGER; Schema: core_data_doses; Owner: postgres
--

CREATE TRIGGER trg_update_dose_mappings_updated_at BEFORE UPDATE ON core_data_doses.dose_mappings FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: food_categories trg_update_food_categories_updated_at; Type: TRIGGER; Schema: core_data_foods; Owner: postgres
--

CREATE TRIGGER trg_update_food_categories_updated_at BEFORE UPDATE ON core_data_foods.food_categories FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: food_category_mappings trg_update_food_category_mappings_updated_at; Type: TRIGGER; Schema: core_data_foods; Owner: postgres
--

CREATE TRIGGER trg_update_food_category_mappings_updated_at BEFORE UPDATE ON core_data_foods.food_category_mappings FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: food_nutrients trg_update_food_nutrients_updated_at; Type: TRIGGER; Schema: core_data_foods; Owner: postgres
--

CREATE TRIGGER trg_update_food_nutrients_updated_at BEFORE UPDATE ON core_data_foods.food_nutrients FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: foods trg_update_foods_updated_at; Type: TRIGGER; Schema: core_data_foods; Owner: postgres
--

CREATE TRIGGER trg_update_foods_updated_at BEFORE UPDATE ON core_data_foods.foods FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: glucose_measurements trg_update_glucose_measurements_updated_at; Type: TRIGGER; Schema: core_data_measurements; Owner: postgres
--

CREATE TRIGGER trg_update_glucose_measurements_updated_at BEFORE UPDATE ON core_data_measurements.glucose_measurements FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: insulin_doses trg_update_insulin_doses_updated_at; Type: TRIGGER; Schema: core_data_measurements; Owner: postgres
--

CREATE TRIGGER trg_update_insulin_doses_updated_at BEFORE UPDATE ON core_data_measurements.insulin_doses FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: daily_dose_events trg_update_daily_dose_events_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_daily_dose_events_updated_at BEFORE UPDATE ON core_data_patients.daily_dose_events FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: daily_food_events trg_update_daily_food_events_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_daily_food_events_updated_at BEFORE UPDATE ON core_data_patients.daily_food_events FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: patient_allergies trg_update_patient_allergies_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_patient_allergies_updated_at BEFORE UPDATE ON core_data_patients.patient_allergies FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: patient_allergy_mappings trg_update_patient_allergy_mappings_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_patient_allergy_mappings_updated_at BEFORE UPDATE ON core_data_patients.patient_allergy_mappings FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: patient_diet_mappings trg_update_patient_diet_mappings_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_patient_diet_mappings_updated_at BEFORE UPDATE ON core_data_patients.patient_diet_mappings FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: patient_diets trg_update_patient_diets_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_patient_diets_updated_at BEFORE UPDATE ON core_data_patients.patient_diets FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: patients trg_update_patients_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_patients_updated_at BEFORE UPDATE ON core_data_patients.patients FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();

--
-- Name: dose_recommendations dose_recommendations_dose_id_fkey; Type: FK CONSTRAINT; Schema: biz_data_dose_recommendations; Owner: postgres
--

ALTER TABLE ONLY biz_data_dose_recommendations.dose_recommendations
ADD CONSTRAINT dose_recommendations_dose_id_fkey FOREIGN KEY (dose_id) REFERENCES core_data_doses.dose_guidelines (id) ON DELETE CASCADE;

--
-- Name: dose_recommendations dose_recommendations_patient_id_fkey; Type: FK CONSTRAINT; Schema: biz_data_dose_recommendations; Owner: postgres
--

ALTER TABLE ONLY biz_data_dose_recommendations.dose_recommendations
ADD CONSTRAINT dose_recommendations_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients (id) ON DELETE CASCADE;

--
-- Name: dose_mappings dose_mappings_dose_id_fkey; Type: FK CONSTRAINT; Schema: core_data_doses; Owner: postgres
--

ALTER TABLE ONLY core_data_doses.dose_mappings
ADD CONSTRAINT dose_mappings_dose_id_fkey FOREIGN KEY (dose_id) REFERENCES core_data_doses.dose_guidelines (id) ON DELETE CASCADE;

--
-- Name: dose_mappings dose_mappings_food_id_fkey; Type: FK CONSTRAINT; Schema: core_data_doses; Owner: postgres
--

ALTER TABLE ONLY core_data_doses.dose_mappings
ADD CONSTRAINT dose_mappings_food_id_fkey FOREIGN KEY (food_id) REFERENCES core_data_foods.foods (id) ON DELETE CASCADE;

--
-- Name: food_category_mappings food_category_mappings_category_id_fkey; Type: FK CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_category_mappings
ADD CONSTRAINT food_category_mappings_category_id_fkey FOREIGN KEY (category_id) REFERENCES core_data_foods.food_categories (id) ON DELETE CASCADE;

--
-- Name: food_category_mappings food_category_mappings_food_id_fkey; Type: FK CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_category_mappings
ADD CONSTRAINT food_category_mappings_food_id_fkey FOREIGN KEY (food_id) REFERENCES core_data_foods.foods (id) ON DELETE CASCADE;

--
-- Name: food_nutrients food_nutrients_food_id_fkey; Type: FK CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_nutrients
ADD CONSTRAINT food_nutrients_food_id_fkey FOREIGN KEY (food_id) REFERENCES core_data_foods.foods (id) ON DELETE CASCADE;

--
-- Name: glucose_measurements glucose_measurements_patient_id_fkey; Type: FK CONSTRAINT; Schema: core_data_measurements; Owner: postgres
--

ALTER TABLE ONLY core_data_measurements.glucose_measurements
ADD CONSTRAINT glucose_measurements_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients (id) ON DELETE CASCADE;

--
-- Name: insulin_doses insulin_doses_patient_id_fkey; Type: FK CONSTRAINT; Schema: core_data_measurements; Owner: postgres
--

ALTER TABLE ONLY core_data_measurements.insulin_doses
ADD CONSTRAINT insulin_doses_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients (id) ON DELETE CASCADE;

--
-- Name: daily_dose_events daily_dose_events_dose_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.daily_dose_events
ADD CONSTRAINT daily_dose_events_dose_id_fkey FOREIGN KEY (dose_id) REFERENCES core_data_doses.dose_guidelines (id) ON DELETE CASCADE;

--
-- Name: daily_dose_events daily_dose_events_patient_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.daily_dose_events
ADD CONSTRAINT daily_dose_events_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients (id) ON DELETE CASCADE;

--
-- Name: daily_food_events daily_food_events_food_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.daily_food_events
ADD CONSTRAINT daily_food_events_food_id_fkey FOREIGN KEY (food_id) REFERENCES core_data_foods.foods (id) ON DELETE CASCADE;

--
-- Name: daily_food_events daily_food_events_patient_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.daily_food_events
ADD CONSTRAINT daily_food_events_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients (id) ON DELETE CASCADE;

--
-- Name: patient_allergy_mappings patient_allergy_mappings_allergy_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_allergy_mappings
ADD CONSTRAINT patient_allergy_mappings_allergy_id_fkey FOREIGN KEY (allergy_id) REFERENCES core_data_patients.patient_allergies (id) ON DELETE CASCADE;

--
-- Name: patient_allergy_mappings patient_allergy_mappings_patient_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_allergy_mappings
ADD CONSTRAINT patient_allergy_mappings_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients (id) ON DELETE CASCADE;

--
-- Name: patient_diet_mappings patient_diet_mappings_diet_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_diet_mappings
ADD CONSTRAINT patient_diet_mappings_diet_id_fkey FOREIGN KEY (diet_id) REFERENCES core_data_patients.patient_diets (id) ON DELETE CASCADE;

--
-- Name: patient_diet_mappings patient_diet_mappings_patient_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_diet_mappings
ADD CONSTRAINT patient_diet_mappings_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients (id) ON DELETE CASCADE;

--
-- PostgreSQL database dump complete
--