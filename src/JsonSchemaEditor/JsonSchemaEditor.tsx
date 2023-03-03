import * as React from "react";
import { useState } from "@hookstate/core";
import { useSchemaState, defaultSchema } from "./state";
import { SchemaEditorProps } from "../JsonSchemaEditor.types";

import { SchemaRoot } from "./schema-root";
import { Whoops } from "./whoops";
import { SchemaObject } from "./schema-object";
import { SchemaArray } from "./schema-array";
import {ConfigProvider} from "@arco-design/web-react";
import {Grid} from "@arco-design/web-react/lib";
export * from "../JsonSchemaEditor.types";


export const JsonSchemaEditor = (props: SchemaEditorProps) => {
	const { onSchemaChange, readOnly, data } = props;

	const schemaState = useSchemaState({
		jsonSchema: data ?? defaultSchema(),
		isReadOnly: readOnly ?? false,
		fieldId: 0,
	});

	const jsonSchemaState = useState(schemaState.jsonSchema);

	return (
		<ConfigProvider>
			<Grid.Row>
			{schemaState.isValidSchema ? (
				<Grid.Col >
					<SchemaRoot
						onSchemaChange={onSchemaChange}
						schemaState={schemaState.jsonSchema}
						isReadOnly={schemaState.isReadOnly}
					/>

					{jsonSchemaState.type.value === "object" && (
						<SchemaObject
							schemaState={jsonSchemaState}
							isReadOnly={schemaState.isReadOnly ?? false}
						/>
					)}

					{jsonSchemaState.type.value === "array" && (
						<SchemaArray
							schemaState={jsonSchemaState}
							isReadOnly={schemaState.isReadOnly ?? false}
						/>
					)}
				</Grid.Col>
				<Grid.Col>
				</Grid.Col>
			) : (
				<Grid.Col >
					<Whoops />
				</Grid.Col>
			)}
			</Grid.Row>
		</ConfigProvider>
	);
};
