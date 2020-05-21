
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
    file_mimetype?: string;
    file_name?: string;
}

export interface User {
    id: number | string;
    email: string;
    username: string;
    token?: string;
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
    analyzers_requested: string[];
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
