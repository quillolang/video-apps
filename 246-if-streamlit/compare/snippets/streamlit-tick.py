@st.fragment(run_every=ss.speed / 1000 if ss.running else None)
def ticker():
    if ss.running:
        ss.ticks += 1
    st.markdown(f"{ss.ticks} ticks")
# ...
ticker()
if ss.running:
    st.text_input("Note", placeholder="A note, while it runs", label_visibility="collapsed")
