export interface IScanForm {
  // required default ones
  md5?: string | Int32Array;
  analyzers_requested?: string[];
  force_privacy: boolean;
  disable_external_analyzers: boolean;
  check_existing_or_force?: string;
  run_all_available_analyzers?: boolean;
  private?: boolean;
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
  observable_classification?: 'ip' | 'domain' | 'hash' | 'url' | 'generic';
  file_name?: string;
  file_mimetype?: string;
  status: string;
  analyzers_requested: string[] | string;
  analyzers_to_execute: string[];
  analysis_reports?: any;
  received_request_time: string | Date;
  finished_analysis_time?: string | Date;
  force_privacy: boolean | string;
  disable_external_analyzers: boolean | string;
  errors?: any;
  file?: any;
  [key: string]: any;
}

export interface IRecentScan {
  jobId: number | string;
  status: string;
}

export interface IAnalyzersList {
  ip: string[];
  hash: string[];
  domain: string[];
  url: string[];
  generic: string[];
  file: string[];
}

export interface IRawAnalyzerConfig {
  [name: string]: IAnalyzerConfig;
}

export interface IAnalyzerConfig {
  name?: string;
  // common fields
  type: string;
  python_module: string;
  external_service?: boolean;
  requires_configuration?: boolean;
  leaks_info?: boolean;
  disabled?: boolean;
  run_hash?: boolean;
  additional_config_params?: any;
  description?: string;
  // one of supported_filetypes or observable_supported
  supported_filetypes?: string[];
  observable_supported?: string[];
}

export interface ILoginPayload {
  token?: string;
  username?: string;
  user?: { username?: string };
}
