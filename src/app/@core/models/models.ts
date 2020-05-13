export interface ObservableForm {
    classifier: string;
    value: string;
    analyzers_list: string[];
    force_privacy: boolean;
    disable_external_analyzers: boolean;
}

export interface FileForm {
    file_type: string;
    file_name: string;
    analyzers_list: string[];
    force_privacy: boolean;
    disable_external_analyzers: boolean;
}

export interface User {
    id: number | string;
    email: string;
    username: string;
    token?: string;
}

export interface Tag {
    id: string | number;
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

