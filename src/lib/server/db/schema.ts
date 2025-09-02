import { relations } from 'drizzle-orm';
import { sqliteTable, integer, text, type AnySQLiteColumn, primaryKey } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
	email: text('email').primaryKey(),
	username: text('username'),
});

export const sessionsTable = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	userEmail: text('user_email').references((): AnySQLiteColumn => usersTable.email)
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
	user: one(usersTable, { fields: [sessionsTable.userEmail], references: [usersTable.email] })
}))

export const userRelations = relations(usersTable, ({ one, many }) => ({
	session: one(sessionsTable),
	usersInLobby: many(usersInLobby)
}));

export const lobbysTable = sqliteTable('lobbys', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	hostEmail: text('host_email').references((): AnySQLiteColumn => usersTable.email),
});

export const lobbysRelations = relations(lobbysTable, ({ many }) => ({
	usersInLobby: many(usersInLobby)
}));

export const usersInLobby = sqliteTable('user_in_lobby', {
	userEmail: text('user_email').notNull().references((): AnySQLiteColumn => usersTable.email),
	lobbyId: integer('lobby_id').notNull().references((): AnySQLiteColumn => lobbysTable.id)
}, (t) => [
	primaryKey({ columns: [t.userEmail, t.lobbyId] })
])

export const usersToLobbysRelations = relations(usersInLobby, ({ one }) => ({
	lobby: one(lobbysTable, {
		fields: [usersInLobby.lobbyId],
		references: [lobbysTable.id]
	}),
	user: one(usersTable, {
		fields: [usersInLobby.userEmail],
		references: [usersTable.email]
	})
}));

export const states = sqliteTable('auth_states', {
	id: text('id').primaryKey(),
	codeVerifier: text('code_verifier').notNull()
})