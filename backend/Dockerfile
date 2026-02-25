FROM rust:1.88-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Create a dummy project to cache dependencies
RUN cargo new --bin HeckerProject
WORKDIR /app/HeckerProject

# manifest info
COPY Cargo.toml Cargo.lock ./

# ARG is for build-time parameters choosing a base image tag, toggling
# Using it in this scenario bakes it into the image layer and this exposes it
# ARG DATABASE_URL

# Needs to be as an environmental variable so cargo/sqlx can see it

#ENV DATABASE_URL=$DATABASE_URL
#This permanently embed the connection string(with credentials) into every layer after it. It also busts the Docker
# on every build if the value changes

# Build
RUN cargo build --release

# Remove the dummy source
RUN rm src/*.rs

# we need to remove this so docker doesn't save the zombie files from the initialization step

COPY ./src ./src

#Build app
RUN touch src/main.rs
RUN cargo build --release

# Stage 2: Runtime
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/HeckerProject/target/release/HeckerProject /app/backend

EXPOSE 8000

#Use entrypoint instead to always run.
# The reason to this is because we always want to assure we have a single entrypoint
#With CMD we run the risk that the image could be used to run something else which is bad

ENTRYPOINT ["./backend"]

#Need to check why the heavy dependency on database

