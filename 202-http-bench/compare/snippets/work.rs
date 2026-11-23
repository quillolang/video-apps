fn work(n: i64) -> i64 {
    let mut total = 0;
    for i in 0..n {
        total = (total + i * i) % 1000003;
    }
    total
}

#[derive(Clone, PartialEq, Serialize, Deserialize)]
struct Total { total: i64 }

#[get("/compute")]
async fn compute() -> Result<Total> {
    // black_box: the compiler can't work the answer out ahead of time; it runs on each request, as in Quillo.
    Ok(Total { total: work(std::hint::black_box(10000)) })
}
