

class Service
  constructor: (@name) ->

  delete: (name, params, data) ->
  get: (name, params) ->
    if Katrid.Settings.servicesProtocol is 'ws'
      # Using websocket protocol
      Katrid.socketio.emit('api', { channel: 'rpc', service: @name, method: name, data: data, args: params })
    else
      # Using http/https protocol
      rpcName = Katrid.Settings.server + '/api/rpc/' + @name + '/' + name + '/'
      $.get(rpcName, params)

  post: (name, params, data) ->
    if Katrid.Settings.servicesProtocol is 'ws'
      Katrid.socketio.emit('api', { channel: 'rpc', service: @name, method: name, data: data, args: params })
    else
      rpcName = Katrid.Settings.server + '/api/rpc/' + @name + '/' + name + '/'
      if params
        rpcName += '?' + $.param(params)
      $.ajax
        method: 'POST'
        url: rpcName
        data: JSON.stringify(data)
        contentType: "application/json; charset=utf-8"
        dataType: 'json'


class Model extends Service
  searchName: (name) ->
    @post('search_name', { name: name })

  createName: (name) ->
    @post('create_name', null, { name: name })

  search: (data, params) ->
    data = { kwargs: data }
    @post('search', params, data)

  destroy: (id) ->
    @post('destroy', null, { kwargs: { ids: [id] } })

  get: (id) ->
    @post('get', null, { kwargs: { id: id } })

  getViewInfo: (data) ->
    @post('get_view_info', null, { kwargs: data })

  doViewAction: (data) ->
    @post('do_view_action', null, { kwargs: data })

  write: (data, params) ->
    @post('write', params, { kwargs: { data: data } })
    .fail ->
      Katrid.Dialogs.Alerts.error(Katrid.i18n.gettext('Error saving record changes'))


@Katrid.Services =
  Service: Service
  Model: Model
