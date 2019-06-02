import createFetch from '@zeit/fetch'
import nodeFetch from 'node-fetch'
export default createFetch(nodeFetch)
