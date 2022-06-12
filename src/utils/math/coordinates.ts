export function latitudeToPhi(lat) {
  return (lat * Math.PI) / 180
}

export function longitudeToTheta(long) {
  return ((long - 180) * Math.PI) / 180
}

export function coordinatesToPosition(coordinates, radius) {
  var lat = coordinates[0],
    long = coordinates[1]
  var phi = latitudeToPhi(lat)
  var theta = longitudeToTheta(long)
  var x = -radius * Math.cos(phi) * Math.cos(theta)
  var y = radius * Math.sin(phi)
  var z = radius * Math.cos(phi) * Math.sin(theta)
  return [x, y, z]
}