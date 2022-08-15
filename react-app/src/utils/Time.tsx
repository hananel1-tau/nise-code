import React from "react";

const toDateTime = (time : number) => {
    return Intl.DateTimeFormat('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(time * 1)
}

const toTime = (time : number) => {
    return Intl.DateTimeFormat('en-GB', {hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(time * 1)
}

const toDate = (time : number) => {
    return Intl.DateTimeFormat('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit'}).format(time * 1)
}


export { toDateTime, toTime, toDate };
