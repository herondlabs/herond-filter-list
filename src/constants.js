const herondListName = 'Herond List'
const herondListComponentId = 'dlibgjfecknlggedcgaabhmefdkfdkgp'
const herondListPublickey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhqhvAl3+uBJ6HJKHxYMxynJiaeWPFJPOZDbe5c3w1A2gegtszpKFL369T+7SM3HPTdvA+P831As3KHGBrYbSpqefLsqTSQyyQlXGfCNVJZHvYYZHxyqDgrGMQ0Pg7HCghvbU2WHij2l31c0Ty9pxXcTjw+IZyWgYOy6KuVr3sPB+HuIoyAAJ1wMRdAcqR1hUKZ0DmluCFhATsN2RUlkmfgqr+y7DHL+W0DLN6w+jxMNVnboPZRVUCx7/q+08c7V1HZpjMspuDslwU87CFkfrG6Q1hJAFj2I6ybc6JtnrcwlDPGaw5R6acqmxDDwpMWNDy7sGsdmdG7axfBbZuY5BowIDAQAB'
const outputPath = `build/${herondListComponentId}`
const s3Bucket = 'herond-ext-updater-prod'
const s3Path = 'release/'

export {
  herondListName,
  herondListComponentId,
  herondListPublickey,
  outputPath,
  s3Bucket,
  s3Path
}
