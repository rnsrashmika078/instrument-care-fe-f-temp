import { useState } from "react";
import {
    DateField,
    IdTag,
    RecordsBadge,
    SearchInput,
    TableCard,
    TableEmpty,
    TableHead,
    TableScroll,
    TableToolbar,
    Td,
    Th,
    Tr,
} from "./TableUI";

function Entity({ prefix, id, name }) {
    const hasId = id !== null && id !== undefined && id !== "";

    if (!hasId) {
        return <span className="text-xs italic text-gray-300">Not linked</span>;
    }

    return (
        <div className="flex flex-col gap-0.5">
            <IdTag prefix={prefix} value={id} />
            {name ? (
                <span className="text-xs text-gray-500">{name}</span>
            ) : null}
        </div>
    );
}

export default function AllInstrument({ instrumentsData }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const filteredInstruments = (instrumentsData || []).filter((inst) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            searchTerm === "" ||
            String(inst.id).toLowerCase().includes(term) ||
            String("Tech/" + inst.technician_id).toLowerCase().includes(term) ||
            (inst.technician_name &&
                inst.technician_name.toLowerCase().includes(term)) ||
            String("Inst/" + inst.instrument_id).toLowerCase().includes(term) ||
            (inst.instrument_name &&
                inst.instrument_name.toLowerCase().includes(term)) ||
            String("NewInst/" + inst.new_instrument_id)
                .toLowerCase()
                .includes(term) ||
            (inst.new_instrument_name &&
                inst.new_instrument_name.toLowerCase().includes(term));

        let withinDateRange = true;
        if (fromDate || toDate) {
            const instDate = new Date(inst.created_at);
            if (fromDate) {
                withinDateRange = withinDateRange && instDate >= new Date(fromDate);
            }
            if (toDate) {
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999);
                withinDateRange = withinDateRange && instDate <= to;
            }
        }

        return matchesSearch && withinDateRange;
    });

    return (
        <TableCard>
            <TableHead
                title="All Instruments"
                subtitle="Instruments registered against technicians and new instrument requests"
            />

            <TableToolbar>
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search by ID or name…"
                />
                <DateField label="From" value={fromDate} onChange={setFromDate} />
                <DateField label="To" value={toDate} onChange={setToDate} />
                <RecordsBadge
                    count={filteredInstruments.length}
                    noun="instruments"
                />
            </TableToolbar>

            {filteredInstruments.length === 0 ? (
                <TableEmpty
                    title="No instruments found"
                    message="No instrument records match the current search and date range."
                    hint="Try clearing the filters"
                />
            ) : (
                <TableScroll>
                    <thead>
                        <tr>
                            <Th>Ref</Th>
                            <Th>Technician</Th>
                            <Th>Instrument</Th>
                            <Th>New Instrument</Th>
                            <Th>Registered</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInstruments.map((inst, i) => (
                            <Tr key={i}>
                                <Td>
                                    <IdTag value={`INS-${String(inst.id).padStart(4, "0")}`} />
                                </Td>
                                <Td>
                                    <Entity
                                        prefix="Tech/"
                                        id={inst.technician_id}
                                        name={inst.technician_name}
                                    />
                                </Td>
                                <Td>
                                    <Entity
                                        prefix="Inst/"
                                        id={inst.instrument_id}
                                        name={inst.instrument_name}
                                    />
                                </Td>
                                <Td>
                                    <Entity
                                        prefix="NewInst/"
                                        id={inst.new_instrument_id}
                                        name={inst.new_instrument_name}
                                    />
                                </Td>
                                <Td>
                                    <span className="whitespace-nowrap text-xs text-gray-500">
                                        {inst.created_at || "—"}
                                    </span>
                                </Td>
                            </Tr>
                        ))}
                    </tbody>
                </TableScroll>
            )}
        </TableCard>
    );
}
