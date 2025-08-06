--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-06 21:49:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 16655)
-- Name: audit_data; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA audit_data;


ALTER SCHEMA audit_data OWNER TO postgres;

--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA audit_data; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA audit_data IS 'Auditoría: accesos y cambios en los datos';


--
-- TOC entry 8 (class 2615 OID 16656)
-- Name: biz_data_dose_recommendations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA biz_data_dose_recommendations;


ALTER SCHEMA biz_data_dose_recommendations OWNER TO postgres;

--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 8
-- Name: SCHEMA biz_data_dose_recommendations; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA biz_data_dose_recommendations IS 'Reglas de negocio: recomendaciones personalizadas de dosis';


--
-- TOC entry 9 (class 2615 OID 16657)
-- Name: core_data_doses; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA core_data_doses;


ALTER SCHEMA core_data_doses OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 9
-- Name: SCHEMA core_data_doses; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA core_data_doses IS 'Datos principales: guías y mappings de dosis';


--
-- TOC entry 10 (class 2615 OID 16658)
-- Name: core_data_foods; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA core_data_foods;


ALTER SCHEMA core_data_foods OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 10
-- Name: SCHEMA core_data_foods; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA core_data_foods IS 'Datos principales: alimentos, categorías y nutrientes';


--
-- TOC entry 11 (class 2615 OID 16659)
-- Name: core_data_measurements; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA core_data_measurements;


ALTER SCHEMA core_data_measurements OWNER TO postgres;

--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 11
-- Name: SCHEMA core_data_measurements; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA core_data_measurements IS 'Datos principales: mediciones de glucosa e insulina';


--
-- TOC entry 12 (class 2615 OID 16660)
-- Name: core_data_patients; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA core_data_patients;


ALTER SCHEMA core_data_patients OWNER TO postgres;

--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 12
-- Name: SCHEMA core_data_patients; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA core_data_patients IS 'Datos principales: información de pacientes y alergias';


--
-- TOC entry 2 (class 3079 OID 16661)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 252 (class 1255 OID 16672)
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
-- TOC entry 224 (class 1259 OID 16673)
-- Name: access_logs; Type: TABLE; Schema: audit_data; Owner: postgres
--

CREATE TABLE audit_data.access_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    access_time timestamp without time zone DEFAULT now() NOT NULL,
    action character varying(255) NOT NULL,
    ip_address character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE audit_data.access_logs OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16680)
-- Name: change_logs; Type: TABLE; Schema: audit_data; Owner: postgres
--

CREATE TABLE audit_data.change_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
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
-- TOC entry 226 (class 1259 OID 16689)
-- Name: dose_recommendations; Type: TABLE; Schema: biz_data_dose_recommendations; Owner: postgres
--

CREATE TABLE biz_data_dose_recommendations.dose_recommendations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    patient_id uuid NOT NULL,
    dose_id uuid NOT NULL,
    conditions text,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE biz_data_dose_recommendations.dose_recommendations OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16697)
-- Name: dose_guidelines; Type: TABLE; Schema: core_data_doses; Owner: postgres
--

CREATE TABLE core_data_doses.dose_guidelines (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description text NOT NULL,
    units character varying(50) NOT NULL,
    insulin_type character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE core_data_doses.dose_guidelines OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16705)
-- Name: dose_mappings; Type: TABLE; Schema: core_data_doses; Owner: postgres
--

CREATE TABLE core_data_doses.dose_mappings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    food_id uuid NOT NULL,
    dose_id uuid NOT NULL,
    dose_amount numeric(8,3) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE core_data_doses.dose_mappings OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16711)
-- Name: food_categories; Type: TABLE; Schema: core_data_foods; Owner: postgres
--

CREATE TABLE core_data_foods.food_categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE core_data_foods.food_categories OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16719)
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
-- TOC entry 231 (class 1259 OID 16724)
-- Name: food_nutrients; Type: TABLE; Schema: core_data_foods; Owner: postgres
--

CREATE TABLE core_data_foods.food_nutrients (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    food_id uuid NOT NULL,
    nutrient character varying(100) NOT NULL,
    amount numeric(8,3) NOT NULL,
    unit character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE core_data_foods.food_nutrients OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16730)
-- Name: foods; Type: TABLE; Schema: core_data_foods; Owner: postgres
--

CREATE TABLE core_data_foods.foods (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    carbs numeric(6,2) NOT NULL,
    proteins numeric(6,2) NOT NULL,
    fats numeric(6,2) NOT NULL,
    calories numeric(8,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE core_data_foods.foods OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16736)
-- Name: glucose_measurements; Type: TABLE; Schema: core_data_measurements; Owner: postgres
--

CREATE TABLE core_data_measurements.glucose_measurements (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    patient_id uuid NOT NULL,
    value numeric(6,2) NOT NULL,
    measurement_time timestamp without time zone NOT NULL,
    context character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE core_data_measurements.glucose_measurements OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16742)
-- Name: insulin_doses; Type: TABLE; Schema: core_data_measurements; Owner: postgres
--

CREATE TABLE core_data_measurements.insulin_doses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    patient_id uuid NOT NULL,
    dose_amount numeric(8,3) NOT NULL,
    dose_time timestamp without time zone NOT NULL,
    insulin_type character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE core_data_measurements.insulin_doses OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16748)
-- Name: daily_dose_events; Type: TABLE; Schema: core_data_patients; Owner: postgres
--

CREATE TABLE core_data_patients.daily_dose_events (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    patient_id uuid NOT NULL,
    dose_id uuid NOT NULL,
    dose_amount numeric(8,3) NOT NULL,
    event_time timestamp without time zone DEFAULT now() NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE core_data_patients.daily_dose_events OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16757)
-- Name: daily_food_events; Type: TABLE; Schema: core_data_patients; Owner: postgres
--

CREATE TABLE core_data_patients.daily_food_events (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    patient_id uuid NOT NULL,
    food_id uuid NOT NULL,
    amount numeric(8,2) NOT NULL,
    event_time timestamp without time zone DEFAULT now() NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE core_data_patients.daily_food_events OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16766)
-- Name: patient_allergies; Type: TABLE; Schema: core_data_patients; Owner: postgres
--

CREATE TABLE core_data_patients.patient_allergies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    allergy character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE core_data_patients.patient_allergies OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16772)
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
-- TOC entry 239 (class 1259 OID 16777)
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
-- TOC entry 240 (class 1259 OID 16782)
-- Name: patient_diets; Type: TABLE; Schema: core_data_patients; Owner: postgres
--

CREATE TABLE core_data_patients.patient_diets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    diet_plan text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE core_data_patients.patient_diets OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16790)
-- Name: patients; Type: TABLE; Schema: core_data_patients; Owner: postgres
--

CREATE TABLE core_data_patients.patients (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
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
-- TOC entry 5008 (class 0 OID 16673)
-- Dependencies: 224
-- Data for Name: access_logs; Type: TABLE DATA; Schema: audit_data; Owner: postgres
--

COPY audit_data.access_logs (id, user_id, access_time, action, ip_address, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5009 (class 0 OID 16680)
-- Dependencies: 225
-- Data for Name: change_logs; Type: TABLE DATA; Schema: audit_data; Owner: postgres
--

COPY audit_data.change_logs (id, entity, entity_id, change_type, changed_by, change_time, details, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5010 (class 0 OID 16689)
-- Dependencies: 226
-- Data for Name: dose_recommendations; Type: TABLE DATA; Schema: biz_data_dose_recommendations; Owner: postgres
--

COPY biz_data_dose_recommendations.dose_recommendations (id, patient_id, dose_id, conditions, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5011 (class 0 OID 16697)
-- Dependencies: 227
-- Data for Name: dose_guidelines; Type: TABLE DATA; Schema: core_data_doses; Owner: postgres
--

COPY core_data_doses.dose_guidelines (id, description, units, insulin_type, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5012 (class 0 OID 16705)
-- Dependencies: 228
-- Data for Name: dose_mappings; Type: TABLE DATA; Schema: core_data_doses; Owner: postgres
--

COPY core_data_doses.dose_mappings (id, food_id, dose_id, dose_amount, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5013 (class 0 OID 16711)
-- Dependencies: 229
-- Data for Name: food_categories; Type: TABLE DATA; Schema: core_data_foods; Owner: postgres
--

COPY core_data_foods.food_categories (id, name, description, created_at, updated_at) FROM stdin;
7e6b7c78-5597-4024-ae70-e282ef8a6b85	dairy	Dairy products are foods made from milk, such as cheese, yogurt, and butter. They are a primary source of calcium, protein, and essential vitamins, commonly used in both sweet and savory dishes.	2025-08-06 17:54:48.15891	2025-08-06 17:54:48.15891
ec77f0d2-c083-4bb6-a13a-ad9663c474ef	rice	Rice is a staple grain used in cuisines around the world. It comes in various types such as white, brown, basmati, and jasmine, and serves as a versatile base for countless dishes, both savory and sweet.	2025-08-06 17:56:26.080091	2025-08-06 17:56:26.080091
c1219e57-2884-4279-bbde-3d1b4d8e4582	tubers	Tubers are underground plant structures that store nutrients. Common examples include potatoes, sweet potatoes, and yams. They are rich in carbohydrates and serve as a key energy source in many traditional diets worldwide.	2025-08-06 17:56:48.90169	2025-08-06 17:56:48.90169
c8d92ef9-a7b8-4cc5-9b27-57a82eeaace0	pasta	Pasta refers to a variety of dough-based products typically made from wheat and water, sometimes with eggs. Common types include spaghetti, penne, and fettuccine. It's a versatile ingredient used in a wide range of dishes across global cuisines, especially Italian.	2025-08-06 17:57:26.365457	2025-08-06 17:57:26.365457
106d9526-538e-43d0-8b0a-ce383681775c	flours	Flours are finely ground powders made from grains, legumes, or roots, commonly used as a base ingredient in baking and cooking. Wheat flour is the most common, but there are also alternatives like corn, rice, and almond flour, each offering unique textures and nutritional profiles.	2025-08-06 17:57:54.326782	2025-08-06 17:57:54.326782
998b8d54-b1d8-4550-b7d5-8b6f816a2541	legumes	Legumes are a class of plant-based foods that include beans, lentils, chickpeas, and peas. They are rich in protein, fiber, and essential nutrients, making them a key component in vegetarian and balanced diets around the world.	2025-08-06 17:58:23.362644	2025-08-06 17:58:23.362644
c9952710-8653-4272-805b-93dd02a85343	bread	Bread is a staple baked food made from flour, water, and yeast or other leavening agents. It comes in various forms and textures, from crusty artisan loaves to soft sandwich bread, serving as a fundamental part of meals in many cultures.	2025-08-06 17:58:48.185814	2025-08-06 17:58:48.185814
c747c91c-9c62-4063-a503-faad920268ec	cereals	Cereals are edible grains harvested from grasses such as wheat, barley, oats, and corn. They are a primary source of carbohydrates and form the foundation of many diets worldwide, commonly consumed as whole grains or processed into products like breakfast cereals and flour.	2025-08-06 17:59:52.24932	2025-08-06 17:59:52.24932
1c7a9bab-9299-4ff1-9feb-dcd51b637688	fruits	Fruits are the sweet or savory edible products of plants, typically containing seeds. They are rich in vitamins, minerals, fiber, and antioxidants, and play a crucial role in a healthy diet, consumed fresh, dried, or processed.	2025-08-06 18:00:30.662377	2025-08-06 18:00:30.662377
36a93c4a-0819-4dca-a8c7-4e0b67e96fea	vegetables	Vegetables are edible parts of plants such as leaves, stems, roots, and flowers. They are nutrient-dense foods, rich in vitamins, minerals, and fiber, essential for a balanced diet and widely used in various culinary preparations.	2025-08-06 18:01:00.307517	2025-08-06 18:01:00.307517
2241515c-d594-43fa-bc65-f8798a54dc0f	nuts	Nuts are hard-shelled fruits containing edible seeds, such as almonds, walnuts, and cashews. They are nutrient-rich, providing healthy fats, protein, vitamins, and minerals, and are commonly consumed as snacks or used in cooking and baking.	2025-08-06 18:01:22.576594	2025-08-06 18:01:22.576594
2fca3bf6-6234-464b-affc-aa8044a6c1bb	beverages	Beverages are liquids prepared for drinking, ranging from water, juices, and soft drinks to alcoholic drinks like wine and beer. They serve various purposes including hydration, nutrition, and social or cultural rituals.	2025-08-06 18:02:03.048125	2025-08-06 18:02:03.048125
\.


--
-- TOC entry 5014 (class 0 OID 16719)
-- Dependencies: 230
-- Data for Name: food_category_mappings; Type: TABLE DATA; Schema: core_data_foods; Owner: postgres
--

COPY core_data_foods.food_category_mappings (food_id, category_id, created_at, updated_at) FROM stdin;
00bfc4f5-c524-4b19-b1bd-b153a0a39f6e	7e6b7c78-5597-4024-ae70-e282ef8a6b85	2025-08-06 21:22:39.503816	2025-08-06 21:22:39.503816
dbe214f5-ef81-482e-b673-5aa310779c03	7e6b7c78-5597-4024-ae70-e282ef8a6b85	2025-08-06 21:30:55.434487	2025-08-06 21:30:55.434487
dbe214f5-ef81-482e-b673-5aa310779c03	ec77f0d2-c083-4bb6-a13a-ad9663c474ef	2025-08-06 21:30:55.448418	2025-08-06 21:30:55.448418
99344cac-15b2-44f9-bde2-e4c98c54edf6	7e6b7c78-5597-4024-ae70-e282ef8a6b85	2025-08-06 21:42:10.213471	2025-08-06 21:42:10.213471
99344cac-15b2-44f9-bde2-e4c98c54edf6	ec77f0d2-c083-4bb6-a13a-ad9663c474ef	2025-08-06 21:42:10.224691	2025-08-06 21:42:10.224691
c4a09faf-8138-4df7-ab72-b12ae07a833a	7e6b7c78-5597-4024-ae70-e282ef8a6b85	2025-08-06 21:47:01.690571	2025-08-06 21:47:01.690571
c4a09faf-8138-4df7-ab72-b12ae07a833a	ec77f0d2-c083-4bb6-a13a-ad9663c474ef	2025-08-06 21:47:01.7028	2025-08-06 21:47:01.7028
\.


--
-- TOC entry 5015 (class 0 OID 16724)
-- Dependencies: 231
-- Data for Name: food_nutrients; Type: TABLE DATA; Schema: core_data_foods; Owner: postgres
--

COPY core_data_foods.food_nutrients (id, food_id, nutrient, amount, unit, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5016 (class 0 OID 16730)
-- Dependencies: 232
-- Data for Name: foods; Type: TABLE DATA; Schema: core_data_foods; Owner: postgres
--

COPY core_data_foods.foods (id, name, carbs, proteins, fats, calories, created_at, updated_at) FROM stdin;
3206b958-cde4-4fce-a45a-03c143421aaa	cuajada	10.00	5.00	2.00	100.00	2025-07-27 17:42:42.601175	2025-07-27 17:42:42.601175
3377a8e8-8408-445c-89e6-ae21c4c77521	flan	20.00	5.00	2.00	100.00	2025-07-27 18:14:02.423301	2025-07-27 18:37:30.669251
00bfc4f5-c524-4b19-b1bd-b153a0a39f6e	Helado de Hielo	23.00	23.00	23.00	23.00	2025-08-06 21:22:39.441388	2025-08-06 21:22:39.441388
dbe214f5-ef81-482e-b673-5aa310779c03	Helado sin azucar	23.00	23.00	23.00	23.00	2025-08-06 21:30:55.339777	2025-08-06 21:30:55.339777
99344cac-15b2-44f9-bde2-e4c98c54edf6	Leche	23.00	23.00	23.00	23.00	2025-08-06 21:42:10.186516	2025-08-06 21:42:10.186516
c4a09faf-8138-4df7-ab72-b12ae07a833a	Leche Condensada	23.00	23.00	23.00	23.00	2025-08-06 21:47:01.641565	2025-08-06 21:47:01.641565
\.


--
-- TOC entry 5017 (class 0 OID 16736)
-- Dependencies: 233
-- Data for Name: glucose_measurements; Type: TABLE DATA; Schema: core_data_measurements; Owner: postgres
--

COPY core_data_measurements.glucose_measurements (id, patient_id, value, measurement_time, context, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5018 (class 0 OID 16742)
-- Dependencies: 234
-- Data for Name: insulin_doses; Type: TABLE DATA; Schema: core_data_measurements; Owner: postgres
--

COPY core_data_measurements.insulin_doses (id, patient_id, dose_amount, dose_time, insulin_type, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5019 (class 0 OID 16748)
-- Dependencies: 235
-- Data for Name: daily_dose_events; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--

COPY core_data_patients.daily_dose_events (id, patient_id, dose_id, dose_amount, event_time, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5020 (class 0 OID 16757)
-- Dependencies: 236
-- Data for Name: daily_food_events; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--

COPY core_data_patients.daily_food_events (id, patient_id, food_id, amount, event_time, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5021 (class 0 OID 16766)
-- Dependencies: 237
-- Data for Name: patient_allergies; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--

COPY core_data_patients.patient_allergies (id, allergy, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5022 (class 0 OID 16772)
-- Dependencies: 238
-- Data for Name: patient_allergy_mappings; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--

COPY core_data_patients.patient_allergy_mappings (patient_id, allergy_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5023 (class 0 OID 16777)
-- Dependencies: 239
-- Data for Name: patient_diet_mappings; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--

COPY core_data_patients.patient_diet_mappings (patient_id, diet_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5024 (class 0 OID 16782)
-- Dependencies: 240
-- Data for Name: patient_diets; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--

COPY core_data_patients.patient_diets (id, diet_plan, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5025 (class 0 OID 16790)
-- Dependencies: 241
-- Data for Name: patients; Type: TABLE DATA; Schema: core_data_patients; Owner: postgres
--

COPY core_data_patients.patients (id, name, email, phone, dob, diagnosis_date, type_diabetes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4782 (class 2606 OID 16799)
-- Name: access_logs access_logs_pkey; Type: CONSTRAINT; Schema: audit_data; Owner: postgres
--

ALTER TABLE ONLY audit_data.access_logs
    ADD CONSTRAINT access_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4784 (class 2606 OID 16801)
-- Name: change_logs change_logs_pkey; Type: CONSTRAINT; Schema: audit_data; Owner: postgres
--

ALTER TABLE ONLY audit_data.change_logs
    ADD CONSTRAINT change_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4786 (class 2606 OID 16803)
-- Name: dose_recommendations dose_recommendations_pkey; Type: CONSTRAINT; Schema: biz_data_dose_recommendations; Owner: postgres
--

ALTER TABLE ONLY biz_data_dose_recommendations.dose_recommendations
    ADD CONSTRAINT dose_recommendations_pkey PRIMARY KEY (id);


--
-- TOC entry 4788 (class 2606 OID 16805)
-- Name: dose_guidelines dose_guidelines_pkey; Type: CONSTRAINT; Schema: core_data_doses; Owner: postgres
--

ALTER TABLE ONLY core_data_doses.dose_guidelines
    ADD CONSTRAINT dose_guidelines_pkey PRIMARY KEY (id);


--
-- TOC entry 4790 (class 2606 OID 16807)
-- Name: dose_mappings dose_mappings_food_id_dose_id_key; Type: CONSTRAINT; Schema: core_data_doses; Owner: postgres
--

ALTER TABLE ONLY core_data_doses.dose_mappings
    ADD CONSTRAINT dose_mappings_food_id_dose_id_key UNIQUE (food_id, dose_id);


--
-- TOC entry 4792 (class 2606 OID 16809)
-- Name: dose_mappings dose_mappings_pkey; Type: CONSTRAINT; Schema: core_data_doses; Owner: postgres
--

ALTER TABLE ONLY core_data_doses.dose_mappings
    ADD CONSTRAINT dose_mappings_pkey PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 16811)
-- Name: food_categories food_categories_name_key; Type: CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_categories
    ADD CONSTRAINT food_categories_name_key UNIQUE (name);


--
-- TOC entry 4796 (class 2606 OID 16813)
-- Name: food_categories food_categories_pkey; Type: CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_categories
    ADD CONSTRAINT food_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4798 (class 2606 OID 16815)
-- Name: food_category_mappings food_category_mappings_pkey; Type: CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_category_mappings
    ADD CONSTRAINT food_category_mappings_pkey PRIMARY KEY (food_id, category_id);


--
-- TOC entry 4800 (class 2606 OID 16817)
-- Name: food_nutrients food_nutrients_pkey; Type: CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_nutrients
    ADD CONSTRAINT food_nutrients_pkey PRIMARY KEY (id);


--
-- TOC entry 4802 (class 2606 OID 16819)
-- Name: foods foods_name_key; Type: CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.foods
    ADD CONSTRAINT foods_name_key UNIQUE (name);


--
-- TOC entry 4804 (class 2606 OID 16821)
-- Name: foods foods_pkey; Type: CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.foods
    ADD CONSTRAINT foods_pkey PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 16823)
-- Name: glucose_measurements glucose_measurements_pkey; Type: CONSTRAINT; Schema: core_data_measurements; Owner: postgres
--

ALTER TABLE ONLY core_data_measurements.glucose_measurements
    ADD CONSTRAINT glucose_measurements_pkey PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 16825)
-- Name: insulin_doses insulin_doses_pkey; Type: CONSTRAINT; Schema: core_data_measurements; Owner: postgres
--

ALTER TABLE ONLY core_data_measurements.insulin_doses
    ADD CONSTRAINT insulin_doses_pkey PRIMARY KEY (id);


--
-- TOC entry 4812 (class 2606 OID 16827)
-- Name: daily_dose_events daily_dose_events_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.daily_dose_events
    ADD CONSTRAINT daily_dose_events_pkey PRIMARY KEY (id);


--
-- TOC entry 4815 (class 2606 OID 16829)
-- Name: daily_food_events daily_food_events_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.daily_food_events
    ADD CONSTRAINT daily_food_events_pkey PRIMARY KEY (id);


--
-- TOC entry 4818 (class 2606 OID 16831)
-- Name: patient_allergies patient_allergies_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_allergies
    ADD CONSTRAINT patient_allergies_pkey PRIMARY KEY (id);


--
-- TOC entry 4820 (class 2606 OID 16833)
-- Name: patient_allergy_mappings patient_allergy_mappings_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_allergy_mappings
    ADD CONSTRAINT patient_allergy_mappings_pkey PRIMARY KEY (patient_id, allergy_id);


--
-- TOC entry 4822 (class 2606 OID 16835)
-- Name: patient_diet_mappings patient_diet_mappings_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_diet_mappings
    ADD CONSTRAINT patient_diet_mappings_pkey PRIMARY KEY (patient_id, diet_id);


--
-- TOC entry 4824 (class 2606 OID 16837)
-- Name: patient_diets patient_diets_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_diets
    ADD CONSTRAINT patient_diets_pkey PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 16839)
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- TOC entry 4807 (class 1259 OID 16840)
-- Name: idx_glucose_measurements_patient; Type: INDEX; Schema: core_data_measurements; Owner: postgres
--

CREATE INDEX idx_glucose_measurements_patient ON core_data_measurements.glucose_measurements USING btree (patient_id);


--
-- TOC entry 4808 (class 1259 OID 16841)
-- Name: idx_insulin_doses_patient; Type: INDEX; Schema: core_data_measurements; Owner: postgres
--

CREATE INDEX idx_insulin_doses_patient ON core_data_measurements.insulin_doses USING btree (patient_id);


--
-- TOC entry 4813 (class 1259 OID 16842)
-- Name: idx_daily_dose_events_patient; Type: INDEX; Schema: core_data_patients; Owner: postgres
--

CREATE INDEX idx_daily_dose_events_patient ON core_data_patients.daily_dose_events USING btree (patient_id);


--
-- TOC entry 4816 (class 1259 OID 16843)
-- Name: idx_daily_food_events_patient; Type: INDEX; Schema: core_data_patients; Owner: postgres
--

CREATE INDEX idx_daily_food_events_patient ON core_data_patients.daily_food_events USING btree (patient_id);


--
-- TOC entry 4825 (class 1259 OID 16844)
-- Name: idx_patients_email; Type: INDEX; Schema: core_data_patients; Owner: postgres
--

CREATE INDEX idx_patients_email ON core_data_patients.patients USING btree (email);


--
-- TOC entry 4845 (class 2620 OID 16845)
-- Name: access_logs trg_update_access_logs_updated_at; Type: TRIGGER; Schema: audit_data; Owner: postgres
--

CREATE TRIGGER trg_update_access_logs_updated_at BEFORE UPDATE ON audit_data.access_logs FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4846 (class 2620 OID 16846)
-- Name: change_logs trg_update_change_logs_updated_at; Type: TRIGGER; Schema: audit_data; Owner: postgres
--

CREATE TRIGGER trg_update_change_logs_updated_at BEFORE UPDATE ON audit_data.change_logs FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4847 (class 2620 OID 16847)
-- Name: dose_recommendations trg_update_dose_recommendations_updated_at; Type: TRIGGER; Schema: biz_data_dose_recommendations; Owner: postgres
--

CREATE TRIGGER trg_update_dose_recommendations_updated_at BEFORE UPDATE ON biz_data_dose_recommendations.dose_recommendations FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4848 (class 2620 OID 16848)
-- Name: dose_guidelines trg_update_dose_guidelines_updated_at; Type: TRIGGER; Schema: core_data_doses; Owner: postgres
--

CREATE TRIGGER trg_update_dose_guidelines_updated_at BEFORE UPDATE ON core_data_doses.dose_guidelines FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4849 (class 2620 OID 16849)
-- Name: dose_mappings trg_update_dose_mappings_updated_at; Type: TRIGGER; Schema: core_data_doses; Owner: postgres
--

CREATE TRIGGER trg_update_dose_mappings_updated_at BEFORE UPDATE ON core_data_doses.dose_mappings FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4850 (class 2620 OID 16850)
-- Name: food_categories trg_update_food_categories_updated_at; Type: TRIGGER; Schema: core_data_foods; Owner: postgres
--

CREATE TRIGGER trg_update_food_categories_updated_at BEFORE UPDATE ON core_data_foods.food_categories FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4851 (class 2620 OID 16851)
-- Name: food_category_mappings trg_update_food_category_mappings_updated_at; Type: TRIGGER; Schema: core_data_foods; Owner: postgres
--

CREATE TRIGGER trg_update_food_category_mappings_updated_at BEFORE UPDATE ON core_data_foods.food_category_mappings FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4852 (class 2620 OID 16852)
-- Name: food_nutrients trg_update_food_nutrients_updated_at; Type: TRIGGER; Schema: core_data_foods; Owner: postgres
--

CREATE TRIGGER trg_update_food_nutrients_updated_at BEFORE UPDATE ON core_data_foods.food_nutrients FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4853 (class 2620 OID 16853)
-- Name: foods trg_update_foods_updated_at; Type: TRIGGER; Schema: core_data_foods; Owner: postgres
--

CREATE TRIGGER trg_update_foods_updated_at BEFORE UPDATE ON core_data_foods.foods FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4854 (class 2620 OID 16854)
-- Name: glucose_measurements trg_update_glucose_measurements_updated_at; Type: TRIGGER; Schema: core_data_measurements; Owner: postgres
--

CREATE TRIGGER trg_update_glucose_measurements_updated_at BEFORE UPDATE ON core_data_measurements.glucose_measurements FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4855 (class 2620 OID 16855)
-- Name: insulin_doses trg_update_insulin_doses_updated_at; Type: TRIGGER; Schema: core_data_measurements; Owner: postgres
--

CREATE TRIGGER trg_update_insulin_doses_updated_at BEFORE UPDATE ON core_data_measurements.insulin_doses FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4856 (class 2620 OID 16856)
-- Name: daily_dose_events trg_update_daily_dose_events_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_daily_dose_events_updated_at BEFORE UPDATE ON core_data_patients.daily_dose_events FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4857 (class 2620 OID 16857)
-- Name: daily_food_events trg_update_daily_food_events_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_daily_food_events_updated_at BEFORE UPDATE ON core_data_patients.daily_food_events FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4858 (class 2620 OID 16858)
-- Name: patient_allergies trg_update_patient_allergies_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_patient_allergies_updated_at BEFORE UPDATE ON core_data_patients.patient_allergies FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4859 (class 2620 OID 16859)
-- Name: patient_allergy_mappings trg_update_patient_allergy_mappings_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_patient_allergy_mappings_updated_at BEFORE UPDATE ON core_data_patients.patient_allergy_mappings FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4860 (class 2620 OID 16860)
-- Name: patient_diet_mappings trg_update_patient_diet_mappings_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_patient_diet_mappings_updated_at BEFORE UPDATE ON core_data_patients.patient_diet_mappings FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4861 (class 2620 OID 16861)
-- Name: patient_diets trg_update_patient_diets_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_patient_diets_updated_at BEFORE UPDATE ON core_data_patients.patient_diets FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4862 (class 2620 OID 16862)
-- Name: patients trg_update_patients_updated_at; Type: TRIGGER; Schema: core_data_patients; Owner: postgres
--

CREATE TRIGGER trg_update_patients_updated_at BEFORE UPDATE ON core_data_patients.patients FOR EACH ROW EXECUTE FUNCTION core_data_foods.set_updated_at();


--
-- TOC entry 4828 (class 2606 OID 16863)
-- Name: dose_recommendations dose_recommendations_dose_id_fkey; Type: FK CONSTRAINT; Schema: biz_data_dose_recommendations; Owner: postgres
--

ALTER TABLE ONLY biz_data_dose_recommendations.dose_recommendations
    ADD CONSTRAINT dose_recommendations_dose_id_fkey FOREIGN KEY (dose_id) REFERENCES core_data_doses.dose_guidelines(id) ON DELETE CASCADE;


--
-- TOC entry 4829 (class 2606 OID 16868)
-- Name: dose_recommendations dose_recommendations_patient_id_fkey; Type: FK CONSTRAINT; Schema: biz_data_dose_recommendations; Owner: postgres
--

ALTER TABLE ONLY biz_data_dose_recommendations.dose_recommendations
    ADD CONSTRAINT dose_recommendations_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients(id) ON DELETE CASCADE;


--
-- TOC entry 4830 (class 2606 OID 16873)
-- Name: dose_mappings dose_mappings_dose_id_fkey; Type: FK CONSTRAINT; Schema: core_data_doses; Owner: postgres
--

ALTER TABLE ONLY core_data_doses.dose_mappings
    ADD CONSTRAINT dose_mappings_dose_id_fkey FOREIGN KEY (dose_id) REFERENCES core_data_doses.dose_guidelines(id) ON DELETE CASCADE;


--
-- TOC entry 4831 (class 2606 OID 16878)
-- Name: dose_mappings dose_mappings_food_id_fkey; Type: FK CONSTRAINT; Schema: core_data_doses; Owner: postgres
--

ALTER TABLE ONLY core_data_doses.dose_mappings
    ADD CONSTRAINT dose_mappings_food_id_fkey FOREIGN KEY (food_id) REFERENCES core_data_foods.foods(id) ON DELETE CASCADE;


--
-- TOC entry 4832 (class 2606 OID 16883)
-- Name: food_category_mappings food_category_mappings_category_id_fkey; Type: FK CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_category_mappings
    ADD CONSTRAINT food_category_mappings_category_id_fkey FOREIGN KEY (category_id) REFERENCES core_data_foods.food_categories(id) ON DELETE CASCADE;


--
-- TOC entry 4833 (class 2606 OID 16888)
-- Name: food_category_mappings food_category_mappings_food_id_fkey; Type: FK CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_category_mappings
    ADD CONSTRAINT food_category_mappings_food_id_fkey FOREIGN KEY (food_id) REFERENCES core_data_foods.foods(id) ON DELETE CASCADE;


--
-- TOC entry 4834 (class 2606 OID 16893)
-- Name: food_nutrients food_nutrients_food_id_fkey; Type: FK CONSTRAINT; Schema: core_data_foods; Owner: postgres
--

ALTER TABLE ONLY core_data_foods.food_nutrients
    ADD CONSTRAINT food_nutrients_food_id_fkey FOREIGN KEY (food_id) REFERENCES core_data_foods.foods(id) ON DELETE CASCADE;


--
-- TOC entry 4835 (class 2606 OID 16898)
-- Name: glucose_measurements glucose_measurements_patient_id_fkey; Type: FK CONSTRAINT; Schema: core_data_measurements; Owner: postgres
--

ALTER TABLE ONLY core_data_measurements.glucose_measurements
    ADD CONSTRAINT glucose_measurements_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients(id) ON DELETE CASCADE;


--
-- TOC entry 4836 (class 2606 OID 16903)
-- Name: insulin_doses insulin_doses_patient_id_fkey; Type: FK CONSTRAINT; Schema: core_data_measurements; Owner: postgres
--

ALTER TABLE ONLY core_data_measurements.insulin_doses
    ADD CONSTRAINT insulin_doses_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients(id) ON DELETE CASCADE;


--
-- TOC entry 4837 (class 2606 OID 16908)
-- Name: daily_dose_events daily_dose_events_dose_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.daily_dose_events
    ADD CONSTRAINT daily_dose_events_dose_id_fkey FOREIGN KEY (dose_id) REFERENCES core_data_doses.dose_guidelines(id) ON DELETE CASCADE;


--
-- TOC entry 4838 (class 2606 OID 16913)
-- Name: daily_dose_events daily_dose_events_patient_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.daily_dose_events
    ADD CONSTRAINT daily_dose_events_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients(id) ON DELETE CASCADE;


--
-- TOC entry 4839 (class 2606 OID 16918)
-- Name: daily_food_events daily_food_events_food_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.daily_food_events
    ADD CONSTRAINT daily_food_events_food_id_fkey FOREIGN KEY (food_id) REFERENCES core_data_foods.foods(id) ON DELETE CASCADE;


--
-- TOC entry 4840 (class 2606 OID 16923)
-- Name: daily_food_events daily_food_events_patient_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.daily_food_events
    ADD CONSTRAINT daily_food_events_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients(id) ON DELETE CASCADE;


--
-- TOC entry 4841 (class 2606 OID 16928)
-- Name: patient_allergy_mappings patient_allergy_mappings_allergy_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_allergy_mappings
    ADD CONSTRAINT patient_allergy_mappings_allergy_id_fkey FOREIGN KEY (allergy_id) REFERENCES core_data_patients.patient_allergies(id) ON DELETE CASCADE;


--
-- TOC entry 4842 (class 2606 OID 16933)
-- Name: patient_allergy_mappings patient_allergy_mappings_patient_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_allergy_mappings
    ADD CONSTRAINT patient_allergy_mappings_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients(id) ON DELETE CASCADE;


--
-- TOC entry 4843 (class 2606 OID 16938)
-- Name: patient_diet_mappings patient_diet_mappings_diet_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_diet_mappings
    ADD CONSTRAINT patient_diet_mappings_diet_id_fkey FOREIGN KEY (diet_id) REFERENCES core_data_patients.patient_diets(id) ON DELETE CASCADE;


--
-- TOC entry 4844 (class 2606 OID 16943)
-- Name: patient_diet_mappings patient_diet_mappings_patient_id_fkey; Type: FK CONSTRAINT; Schema: core_data_patients; Owner: postgres
--

ALTER TABLE ONLY core_data_patients.patient_diet_mappings
    ADD CONSTRAINT patient_diet_mappings_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES core_data_patients.patients(id) ON DELETE CASCADE;


-- Completed on 2025-08-06 21:49:07

--
-- PostgreSQL database dump complete
--

