# Six kinds of state on one page, each with a +1.
class CountersController < ApplicationController
  def show
    @n = params[:n].to_i                 # the address: ?n=
    @visitor = session[:visitor].to_i    # this visitor: Rails' session, an encrypted cookie
    @everyone = Everyone.value
    @saved = Count.read("saved")
    @synced = Count.read("synced")
  end

  def visitor
    session[:visitor] = session[:visitor].to_i + 1
    back
  end

  def everyone
    Everyone.add
    back
  end

  def saved
    Count.add("saved")
    back
  end

  # Kept in sync: every page subscribed to "counts" gets the new count,
  # as a Turbo Stream over Action Cable.
  def synced
    Count.add("synced")
    count = Count.read("synced")
    Turbo::StreamsChannel.broadcast_update_to "counts", target: "synced", html: "Kept in sync: #{count}"
    back
  end

  private

  def back = redirect_to(root_path(n: params[:n]))
end
