export interface IScanForm {
  // required default ones
  md5?: string | Int32Array;
  analyzers_requested: string[];
  connectors_requested: string[];
  tlp?: 'WHITE' | 'GREEN' | 'AMBER' | 'RED';
  check_existing_or_force?: string;
  // extra config
  tags_id: number[];
  classification: 'ip' | 'domain' | 'hash' | 'url' | 'generic' | 'file';
  runtime_configuration?: Object;
  // for observable form
  observable_name?: string;
  // for file form
  file?: File;
  file_name?: string;
}

export interface Tag {
  id?: number;
  label?: string;
  color?: string;
}

export interface Job {
  id: number | string;
  source: string;
  type?: string;
  tags: Tag[];
  is_sample?: boolean | string;
  md5: string;
  observable_name?: string;
  observable_classification?: 'ip' | 'domain' | 'hash' | 'url' | 'generic' | '';
  file_name?: string;
  file_mimetype?: string;
  status: string;
  analyzers_requested: string[] | string;
  connectors_requested: string[] | string;
  analyzers_to_execute: string[];
  connectors_to_execute: string[];
  analyzer_reports?: any[];
  connector_reports?: any[];
  received_request_time: string | Date;
  finished_analysis_time?: string | Date;
  job_process_time?: number;
  errors?: any;
  file?: any;
  [key: string]: any;
}

export interface IRecentScan {
  jobId: number | string;
  status: string;
}

export interface IRawAnalyzerConfig {
  [name: string]: IAnalyzerConfig;
}

export interface IRawConnectorConfig {
  [name: string]: IConnectorConfig;
}

export interface IAbstractConfig {
  // Abstract for common fields in IAnalyzerConfig and IConnectorConfig
  name?: string;
  python_module: string;
  description?: string;
  config: any;
  secrets?: any;
  verification?: {
    configured?: boolean;
    error_message?: string;
    missing_secrets?: string[];
  };
}

export interface IAnalyzerConfig extends IAbstractConfig {
  disabled?: boolean;
  type: string;
  external_service?: boolean;
  leaks_info?: boolean;
  run_hash?: boolean;
  run_hash_type?: string;
  // one of supported_filetypes or observable_supported
  supported_filetypes?: string[];
  not_supported_filetypes?: string[];
  observable_supported?: string[];
}

export interface IConnectorConfig extends IAbstractConfig {
  disabled?: boolean;
}

export interface IAnalyzersList {
  ip: IAnalyzerConfig[];
  hash: IAnalyzerConfig[];
  domain: IAnalyzerConfig[];
  url: IAnalyzerConfig[];
  generic: IAnalyzerConfig[];
  file: IAnalyzerConfig[];
}

export interface ILoginPayload {
  token?: string;
  username?: string;
  user?: { username?: string };
}

export interface HealthCheckStatus {
  status?: boolean | null;
}
