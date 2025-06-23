export type logLevel = 'INFO' | 'ERROR' | 'WARN';

interface logType{
    level : logLevel,
    message : string,
    context ?: Record<string,any>,
}

export function logger({level,message,context={}}: logType) : void{
    const logObj = {
        level,
        message,
        ...context 
    };
    const output = (JSON.stringify(logObj));

    switch(level){
        case 'ERROR':
            console.error(output);
            break;
        case 'WARN':
            console.warn(output);
            break;
        default:
            console.log(output);
    }
}