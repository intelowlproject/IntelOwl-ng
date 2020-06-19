interface IntelOwlScanForm {
  is_sample: boolean;
  md5?: string | Int32Array;
  analyzers_requested?: string[];
  force_privacy: boolean;
  disable_external_analyzers: boolean;
  running_only?: boolean;
  run_all_available_analyzers?: boolean;
  tags_id: number[];
}

export interface ObservableForm extends IntelOwlScanForm {
  observable_classification?: string;
  observable_name?: string;
}

export interface FileForm extends IntelOwlScanForm {
  file?: File;
  file_name?: string;
}

export interface IUser {
  id: number | string;
  email?: string;
  username: string;
}

export interface IToken {
  access: string;
  refresh: string;
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
  observable_classification?: string;
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

export interface IObservableAnalyzers {
  ip: any[];
  hash: any[];
  domain: any[];
  url: any[];
}

export interface IRawAnalyzerConfig {
  name?: string;
  type: string;
  python_module: string;
  // one of supported_filetypes or observable_supported
  supported_filetypes?: string[];
  observable_supported?: string[];
  external_service?: boolean;
  requires_configuration?: boolean;
  leaks_info?: boolean;
  disabled?: boolean;
  run_hash?: boolean;
  additional_config_params?: any;
}
