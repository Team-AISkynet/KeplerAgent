import { api } from 'encore.dev/api'
import { GeoJSON } from 'geojson'
import fs from 'node:fs'
import log from 'encore.dev/log'
import { APICallMeta, currentRequest } from 'encore.dev'

interface RegionsResponse {
  data: GeoJSON
}

export const regions = api.raw(
  {
    expose: true,
    method: 'GET',
    path: '/data/geojson/:name',
  },
  async (req, resp) => {
    const { name } = (currentRequest() as APICallMeta).pathParams

    const geojson = fs.readFileSync(`./api/data/geojson/${name}.geojson`, 'utf8')

    const chunk = Buffer.from(geojson)
    resp.writeHead(200, { Connection: 'close' })
    resp.end(chunk)
  }
)
