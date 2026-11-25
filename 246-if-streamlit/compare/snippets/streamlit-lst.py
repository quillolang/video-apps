for t in TODOS:
    if ss.show_done or not t["done"]:
        st.markdown(f"- {t['text']}")
