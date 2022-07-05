-- CreateTable
CREATE TABLE "boards" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL DEFAULT '',
    "goalTime" BIGINT NOT NULL DEFAULT 3600000,
    "isRunning" BOOLEAN NOT NULL DEFAULT false,
    "countDown" BOOLEAN NOT NULL DEFAULT true,
    "initialTimeStateChange" TIMESTAMPTZ(6),
    "lastTimeStateChange" TIMESTAMPTZ(6),
    "timeSurpassed" BIGINT NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardId" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "score" BIGINT NOT NULL DEFAULT 0,
    "logo" TEXT,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_iid_key" ON "teams"("id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
