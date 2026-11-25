import streamlit as st

st.set_page_config(page_title="Streamlit", layout="wide")
ss = st.session_state
for k, v in {"unread": 0, "running": False, "speed": 100, "ticks": 0, "show_done": False, "joining": False}.items():
    ss.setdefault(k, v)
TODOS = [
    {"id": 1, "text": "Milk", "done": True},
    {"id": 2, "text": "Bread", "done": False},
    {"id": 3, "text": "Eggs", "done": False},
]


def add_unread():
    ss.unread += 1


def read_all():
    ss.unread = 0


def toggle():
    ss.running = not ss.running


def faster():
    ss.speed = ss.speed / 2


def flip_joining():
    ss.joining = not ss.joining


st.title("Streamlit")
a, b = st.columns(2)
with a.container(key="box-if", border=True):
    st.subheader("Unread")
    st.button("+1 unread", on_click=add_unread)
    st.button("Read all", on_click=read_all)
    if ss.unread == 0:
        st.markdown("All read")
    elif ss.unread == 1:
        st.markdown("1 new message")
    else:
        st.markdown(f"**{ss.unread} new messages**")


@st.fragment(run_every=ss.speed / 1000 if ss.running else None)
def ticker():
    if ss.running:
        ss.ticks += 1
    st.markdown(f"{ss.ticks} ticks")


with b.container(key="box-timer", border=True):
    st.subheader("Ticker")
    st.button("Stop" if ss.running else "Start", key="btn-run", on_click=toggle)
    st.button("Faster", on_click=faster)
    ticker()
    if ss.running:
        st.text_input("Note", placeholder="A note, while it runs", label_visibility="collapsed")
c, d = st.columns(2)
with c.container(key="box-list", border=True):
    st.subheader("Shopping")
    st.checkbox("Show done", key="show_done")
    for t in TODOS:
        if ss.show_done or not t["done"]:
            st.markdown(f"- {t['text']}")
with d.container(key="box-one", border=True):
    st.subheader("Log in or sign up")
    st.button("I have an account" if ss.joining else "I'm new here", key="btn-join", on_click=flip_joining)
    st.text_input(
        "Email",
        key="email",
        placeholder="Work email" if ss.joining else "Your email",
        label_visibility="collapsed",
    )
