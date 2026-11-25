with a.container(key="box-details", border=True):
    st.subheader("Details")
    label = "Hide details" if ss.open else "Show details"
    st.button(label, key="btn-open", on_click=flip, args=("open",))
    if ss.open:
        st.markdown("Ships in 2 days.")
