import streamlit as st

st.set_page_config(page_title="Streamlit", layout="wide")
ss = st.session_state
for k, v in {"open": False, "status": "loading", "unread": 0, "joining": False, "shown": True, "n": 0}.items():
    ss.setdefault(k, v)


def flip(k):
    ss[k] = not ss[k]


def set_status(s):
    ss.status = s


def add_unread():
    ss.unread += 1


def read_all():
    ss.unread = 0


def add_one():
    ss.n += 1


def counter():
    with st.container(key="panel"):
        st.markdown(f"Clicked {ss.n}")
        st.button("+1", key="plus", on_click=add_one)


st.title("Streamlit")
a, b, c = st.columns(3)
with a.container(key="box-details", border=True):
    st.subheader("Details")
    label = "Hide details" if ss.open else "Show details"
    st.button(label, key="btn-open", on_click=flip, args=("open",))
    if ss.open:
        st.markdown("Ships in 2 days.")
with b.container(key="box-status", border=True):
    st.subheader("Status")
    for s in ["loading", "error", "ready"]:
        st.button(s.title(), key=s, on_click=set_status, args=(s,))
    match ss.status:
        case "loading":
            st.markdown("*Loading…*")
        case "error":
            st.markdown("**Couldn't load**")
        case _:
            st.markdown("3 messages")
with c.container(key="box-zero", border=True):
    st.subheader("Unread")
    st.button("+1 unread", on_click=add_unread)
    st.button("Read all", on_click=read_all)
    st.markdown("Inbox" + (f" :red-badge[{ss.unread} new]" if ss.unread > 0 else ""))
d, e, _ = st.columns(3)
with d.container(key="box-switch", border=True):
    st.subheader("Log in or sign up")
    st.button("I have an account" if ss.joining else "I'm new here", key="btn-joining", on_click=flip, args=("joining",))
    if ss.joining:
        st.text_input("Work email", placeholder="Work email", label_visibility="collapsed")
    else:
        st.text_input("Your email", placeholder="Your email", label_visibility="collapsed")
with e.container(key="box-keep", border=True):
    st.subheader("Counter")
    st.button("Hide counter" if ss.shown else "Show counter", key="btn-shown", on_click=flip, args=("shown",))
    if ss.shown:
        counter()
