export interface APIResponse {
    candidates:    Candidate[];
    modelVersion:  string;
}

export interface Candidate {
    content:          Content;
    finishReason:     string;
    citationMetadata: CitationMetadata;
    avgLogprobs:      number;
}

export interface CitationMetadata {
    citationSources: CitationSource[];
}

export interface CitationSource {
    startIndex: number;
    endIndex:   number;
}

export interface Content {
    parts: Part[];
    role:  string;
}

export interface Part {
    text: string;
}


