import * as xml2js from 'xml2js';

/**
 * Parse the specified XML.
 * 
 * @param xml The XML to parse.
 * @returns A promise that returns the parsed XML, as T.
 * 
 * @template T The type that the parsed XML will be returned as.
 */
export function parseXml<T>(xml: xml2js.convertableToString): Promise<T> {
    return new Promise<T>((accept, reject) => {
        
        let parseOptions: xml2js.OptionsV2 = {
            explicitArray: false,
            explicitRoot: false,
            explicitChildren: false,
            explicitCharkey: false,
            mergeAttrs: true
        };

        xml2js.parseString(xml, parseOptions, (error, result) => {
            if (error)
                reject(error);
            else
                accept(result as T);
        });
    });
}
