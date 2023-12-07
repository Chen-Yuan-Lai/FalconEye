--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Ubuntu 16.1-1.pgdg22.04+1)
-- Dumped by pg_dump version 16.1 (Ubuntu 16.1-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE personal_project;
--
-- Name: personal_project; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE personal_project WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';


\connect personal_project

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: action_interval; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.action_interval AS ENUM (
    '1m',
    '5m',
    '10m',
    '30m',
    '1hr',
    '3hr',
    '24hr',
    '1w'
);


--
-- Name: alert_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.alert_status AS ENUM (
    'pending',
    'firing'
);


--
-- Name: eft; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.eft AS ENUM (
    'allow',
    'deny'
);


--
-- Name: event_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.event_status AS ENUM (
    'unhandled',
    'handled'
);


--
-- Name: filter; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.filter AS ENUM (
    'any',
    'all',
    'none'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alert_histories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alert_histories (
    id integer NOT NULL,
    rule_id bigint NOT NULL,
    trigger_time timestamp with time zone DEFAULT now(),
    delete boolean DEFAULT false
);


--
-- Name: alert_histories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alert_histories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alert_histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alert_histories_id_seq OWNED BY public.alert_histories.id;


--
-- Name: alert_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alert_rules (
    id integer NOT NULL,
    project_id bigint NOT NULL,
    filter public.filter NOT NULL,
    action_interval public.action_interval NOT NULL,
    name character varying(127) NOT NULL,
    active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    delete boolean DEFAULT false
);


--
-- Name: alert_tables_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alert_tables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alert_tables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alert_tables_id_seq OWNED BY public.alert_rules.id;


--
-- Name: channels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.channels (
    id integer NOT NULL,
    rule_id bigint NOT NULL,
    user_id bigint NOT NULL,
    type character varying(10) NOT NULL,
    token character varying(127) NOT NULL,
    delete boolean DEFAULT false
);


--
-- Name: channels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.channels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: channels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.channels_id_seq OWNED BY public.channels.id;


--
-- Name: code_blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.code_blocks (
    id integer NOT NULL,
    event_id bigint NOT NULL,
    block text,
    error_line character varying(127),
    error_column_num integer NOT NULL,
    error_line_num integer NOT NULL,
    file_name character varying(255) NOT NULL,
    stack character varying(255) NOT NULL,
    delete boolean DEFAULT false
);


--
-- Name: code_blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.code_blocks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: code_blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.code_blocks_id_seq OWNED BY public.code_blocks.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id integer NOT NULL,
    user_id bigint NOT NULL,
    project_id bigint NOT NULL,
    name character varying(127) NOT NULL,
    status public.event_status DEFAULT 'unhandled'::public.event_status,
    stack text NOT NULL,
    message text NOT NULL,
    os_type character varying(20) NOT NULL,
    os_release character varying(50) NOT NULL,
    architecture character varying(20) NOT NULL,
    version character varying(10) NOT NULL,
    mem_rss integer NOT NULL,
    mem_heap_total integer NOT NULL,
    mem_heap_used integer NOT NULL,
    mem_external integer NOT NULL,
    mem_array_buffers integer NOT NULL,
    up_time numeric(20,0) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    fingerprints character varying(127) NOT NULL,
    work_space_path character varying(255) NOT NULL,
    delete boolean DEFAULT false
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: policies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.policies (
    id integer NOT NULL,
    sub character varying(50) NOT NULL,
    obj character varying(50) NOT NULL,
    act character varying(50) NOT NULL,
    eft public.eft DEFAULT 'allow'::public.eft NOT NULL
);


--
-- Name: policies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.policies_id_seq OWNED BY public.policies.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    framework character varying(50) NOT NULL,
    client_token character varying(255) NOT NULL,
    user_id bigint NOT NULL,
    members bigint[],
    delete boolean DEFAULT false
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: request_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.request_info (
    id integer NOT NULL,
    url character varying(127) NOT NULL,
    method character varying NOT NULL,
    host character varying NOT NULL,
    useragent text NOT NULL,
    accept text NOT NULL,
    query_paras json,
    event_id bigint NOT NULL,
    ip character varying(20),
    delete boolean DEFAULT false
);


--
-- Name: request_info_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.request_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: request_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.request_info_id_seq OWNED BY public.request_info.id;


--
-- Name: source_maps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.source_maps (
    id integer NOT NULL,
    file_name character varying(255) NOT NULL,
    project_id bigint NOT NULL,
    version integer NOT NULL,
    hash_value character varying(255) NOT NULL,
    delete boolean DEFAULT false
);


--
-- Name: source_maps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.source_maps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: source_maps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.source_maps_id_seq OWNED BY public.source_maps.id;


--
-- Name: trigger_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trigger_types (
    id integer NOT NULL,
    description character varying(255) NOT NULL
);


--
-- Name: triggers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.triggers (
    trigger_type_id bigint NOT NULL,
    rule_id bigint NOT NULL,
    threshold character varying(10),
    time_window public.action_interval,
    id integer NOT NULL,
    delete boolean DEFAULT false
);


--
-- Name: triggers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.triggers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: triggers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.triggers_id_seq OWNED BY public.trigger_types.id;


--
-- Name: triggers_id_seq1; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.triggers_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: triggers_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.triggers_id_seq1 OWNED BY public.triggers.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(50) NOT NULL,
    first_name character varying(50) NOT NULL,
    second_name character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    user_key character varying(255) NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: alert_histories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alert_histories ALTER COLUMN id SET DEFAULT nextval('public.alert_histories_id_seq'::regclass);


--
-- Name: alert_rules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alert_rules ALTER COLUMN id SET DEFAULT nextval('public.alert_tables_id_seq'::regclass);


--
-- Name: channels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.channels ALTER COLUMN id SET DEFAULT nextval('public.channels_id_seq'::regclass);


--
-- Name: code_blocks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.code_blocks ALTER COLUMN id SET DEFAULT nextval('public.code_blocks_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: policies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.policies ALTER COLUMN id SET DEFAULT nextval('public.policies_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: request_info id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.request_info ALTER COLUMN id SET DEFAULT nextval('public.request_info_id_seq'::regclass);


--
-- Name: source_maps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.source_maps ALTER COLUMN id SET DEFAULT nextval('public.source_maps_id_seq'::regclass);


--
-- Name: trigger_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trigger_types ALTER COLUMN id SET DEFAULT nextval('public.triggers_id_seq'::regclass);


--
-- Name: triggers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.triggers ALTER COLUMN id SET DEFAULT nextval('public.triggers_id_seq1'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: alert_histories alert_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alert_histories
    ADD CONSTRAINT alert_histories_pkey PRIMARY KEY (id);


--
-- Name: alert_rules alert_tables_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alert_rules
    ADD CONSTRAINT alert_tables_pkey PRIMARY KEY (id);


--
-- Name: channels channels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_pkey PRIMARY KEY (id);


--
-- Name: code_blocks code_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.code_blocks
    ADD CONSTRAINT code_blocks_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: policies policies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: request_info request_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.request_info
    ADD CONSTRAINT request_info_pkey PRIMARY KEY (id);


--
-- Name: source_maps source_maps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.source_maps
    ADD CONSTRAINT source_maps_pkey PRIMARY KEY (id);


--
-- Name: trigger_types triggers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trigger_types
    ADD CONSTRAINT triggers_pkey PRIMARY KEY (id);


--
-- Name: triggers triggers_pkey1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.triggers
    ADD CONSTRAINT triggers_pkey1 PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: alert_histories alert_histories_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alert_histories
    ADD CONSTRAINT alert_histories_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.alert_rules(id);


--
-- Name: channels channels_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.alert_rules(id);


--
-- Name: events events_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: events events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: projects projects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: request_info request_info_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.request_info
    ADD CONSTRAINT request_info_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: source_maps source_maps_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.source_maps
    ADD CONSTRAINT source_maps_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: triggers trigger_rule_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.triggers
    ADD CONSTRAINT trigger_rule_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.alert_rules(id);


--
-- PostgreSQL database dump complete
--

