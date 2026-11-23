function App() {
	const $ = (0, import_compiler_runtime.c)(48);
	ran("App");
	const [items, setItems] = (0, import_react.useState)(ITEMS);
	const [filter, setFilter] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)("");
	let t0;
	let t1;
	let t2;
	let t3;
	let t4;
	let t5;
	let t6;
	if ($[0] !== draft || $[1] !== filter || $[2] !== items) {
		let t7;
		if ($[10] !== filter) {
			t7 = (i) => i.name.toLowerCase().includes(filter.toLowerCase());
			$[10] = filter;
			$[11] = t7;
		} else t7 = $[11];
		const shown = items.filter(t7);
		const open = items.filter(_temp);
		const total = open.reduce(_temp2, 0);
		let t8;
		if ($[12] !== items) {
			t8 = (id) => setItems(items.map((i_2) => i_2.id === id ? {
				...i_2,
				done: !i_2.done
			} : i_2));
			$[12] = items;
			$[13] = t8;
		} else t8 = $[13];
		const toggle = t8;
		let t9;
		if ($[14] !== items) {
			t9 = (id_0) => setItems(items.filter((i_3) => i_3.id !== id_0));
			$[14] = items;
			$[15] = t9;
		} else t9 = $[15];
		const remove = t9;
		let t10;
		if ($[16] !== draft || $[17] !== items) {
			t10 = (e) => {
				e.preventDefault();
				if (!draft.trim()) return;
				const id_1 = Math.max(0, ...items.map(_temp3)) + 1;
				setItems([...items, {
					id: id_1,
					name: draft.trim(),
					cents: 100,
					qty: 1,
					done: false
				}]);
				setDraft("");
			};
			$[16] = draft;
			$[17] = items;
			$[18] = t10;
		} else t10 = $[18];
		const add = t10;
		t2 = "groceries";
		if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
			t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Groceries" });
			$[19] = t3;
		} else t3 = $[19];
		let t11;
		if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
			t11 = (e_0) => setDraft(e_0.target.value);
			$[20] = t11;
		} else t11 = $[20];
		let t12;
		if ($[21] !== draft) {
			t12 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: draft,
				onChange: t11,
				placeholder: "Add an item",
				"aria-label": "New item"
			});
			$[21] = draft;
			$[22] = t12;
		} else t12 = $[22];
		let t13;
		if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
			t13 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: "Add" });
			$[23] = t13;
		} else t13 = $[23];
		if ($[24] !== add || $[25] !== t12) {
			t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "add",
				onSubmit: add,
				children: [t12, t13]
			});
			$[24] = add;
			$[25] = t12;
			$[26] = t4;
		} else t4 = $[26];
		let t14;
		if ($[27] === Symbol.for("react.memo_cache_sentinel")) {
			t14 = (e_1) => setFilter(e_1.target.value);
			$[27] = t14;
		} else t14 = $[27];
		if ($[28] !== filter) {
			t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "filter",
				value: filter,
				onChange: t14,
				placeholder: "Filter",
				"aria-label": "Filter"
			});
			$[28] = filter;
			$[29] = t5;
		} else t5 = $[29];
		const t15 = "summary";
		const t16 = open.length;
		const t17 = " left · ";
		const t18 = money(total);
		if ($[30] !== t15 || $[31] !== t16 || $[32] !== t17 || $[33] !== t18) {
			t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: t15,
				children: [
					t16,
					t17,
					t18
				]
			});
			$[30] = t15;
			$[31] = t16;
			$[32] = t17;
			$[33] = t18;
			$[34] = t6;
		} else t6 = $[34];
		t0 = "list";
		let t19;
		if ($[35] !== remove || $[36] !== toggle) {
			t19 = (i_5) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				item: i_5,
				onToggle: toggle,
				onRemove: remove
			}, i_5.id);
			$[35] = remove;
			$[36] = toggle;
			$[37] = t19;
		} else t19 = $[37];
		t1 = shown.map(t19);
		$[0] = draft;
		$[1] = filter;
		$[2] = items;
		$[3] = t0;
		$[4] = t1;
		$[5] = t2;
		$[6] = t3;
		$[7] = t4;
		$[8] = t5;
		$[9] = t6;
	} else {
		t0 = $[3];
		t1 = $[4];
		t2 = $[5];
		t3 = $[6];
		t4 = $[7];
		t5 = $[8];
		t6 = $[9];
	}
	let t7;
	if ($[38] !== t0 || $[39] !== t1) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: t0,
			children: t1
		});
		$[38] = t0;
		$[39] = t1;
		$[40] = t7;
	} else t7 = $[40];
	let t8;
	if ($[41] !== t2 || $[42] !== t3 || $[43] !== t4 || $[44] !== t5 || $[45] !== t6 || $[46] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: t2,
			children: [
				t3,
				t4,
				t5,
				t6,
				t7
			]
		});
		$[41] = t2;
		$[42] = t3;
		$[43] = t4;
		$[44] = t5;
		$[45] = t6;
		$[46] = t7;
		$[47] = t8;
	} else t8 = $[47];
	return t8;
}
